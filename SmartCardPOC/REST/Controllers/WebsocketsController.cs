using System;
using System.Linq;
using System.Net.WebSockets;
using System.Reactive.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PCSC;
using PCSC.Monitoring;
using PCSC.Reactive;
using PCSC.Reactive.Events;

namespace REST.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebsocketsController : ControllerBase
    {
        // private readonly ILogger<WebsocketsController> _logger;

        // public WebsocketsController(ILogger<WebsocketsController> logger)
        // {
        //     _logger = logger;
        // }

        WebSocket webSocket;

        public WebsocketsController()
        {
            // Run in a different thread
            Thread thread = new Thread(Run);
            thread.Start();
        }

        [HttpGet("/ws")]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                // _logger.Log(LogLevel.Information, "WebSocket connection established");
                await SendMessage("WebSocket connection established");
                await Echo(webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode =
                    400; // Bad request (400) -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
            }
        }

        // Function to Send message to client
        public async Task SendMessage(string message)
        {
            Console.Write(message);
            if (webSocket.State != WebSocketState.Open)
                return;

            var buffer = Encoding.UTF8.GetBytes(message);
            var segment = new ArraySegment<byte>(buffer);
            await webSocket.SendAsync(
                segment,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None
            );
        }

        // Echo function
        private async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                CancellationToken.None
            );
            // Convert the buffer to string
            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            // _logger.Log(LogLevel.Information, $"Received message: {message}");

            while (!result.CloseStatus.HasValue)
            {
                await webSocket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, result.Count),
                    result.MessageType,
                    result.EndOfMessage,
                    CancellationToken.None
                );
                result = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer),
                    CancellationToken.None
                );
            }

            await webSocket.CloseAsync(
                result.CloseStatus.Value,
                result.CloseStatusDescription,
                CancellationToken.None
            );
        }


        // Card Event Handlers
        public void Run()
        {
            Console.WriteLine("This program will monitor all SmartCard readers and display all status changes.");

            // Retrieve the names of all installed readers.
            // var readerNames = GetReaderNames();
            var readers = new[] { "Identiv uTrust 4701 F CL Reader 0" };

            if (!readers.Any())
            {
                Console.WriteLine("You need at least one connected smart card reader.");
                Console.ReadKey();
                return;
            }

            Console.WriteLine("Listen to all reader events. Press any key to stop.");

            var monitorFactory = MonitorFactory.Instance;

            var subscription = monitorFactory
                .CreateObservable(SCardScope.System, readers)
                .Select(GetEventText)
                .Do(Console.WriteLine)
                .Subscribe(
                    onNext: _ => { },
                    onError: OnError);

            Console.ReadKey();
            subscription.Dispose();
        }

        private static void OnError(Exception exception)
        {
            Console.Error.WriteLine("ERROR: {0}", exception.Message);
        }

        private async Task<string> GetEventText(MonitorEvent ev)
        {
            var sb = new StringBuilder();
            sb.Append($"{ev.GetType().Name} - reader: {ev.ReaderName}");
            switch (ev)
            {
                case CardStatusChanged changed:
                    if (changed.NewState == SCRState.Present)
                    {
                        sb.AppendLine("Card inserted");
                    }
                    else if (changed.NewState == SCRState.Empty)
                    {
                        sb.AppendLine("Card removed");
                    }

                    sb.AppendLine($", previous state: {changed.PreviousState}, new state: {changed.NewState}");
                    break;
                // case CardRemoved removed:
                //     if (removed.State == SCRState.Empty)
                //         sb.AppendLine($", state: {removed.State}");
                //     break;
                // case CardInserted inserted:
                //     if (inserted.State == SCRState.Present)
                //         sb.AppendLine($", state: {inserted.State}, ATR: {BitConverter.ToString(inserted.Atr)}");
                //     break;
                // case MonitorInitialized initialized:
                //     sb.AppendLine($", state: {initialized.State}, ATR: {BitConverter.ToString(initialized.Atr)}");
                //     break;
                // case MonitorCardInfoEvent infoEvent:
                //     sb.AppendLine($", state: {infoEvent.State}, ATR: {BitConverter.ToString(infoEvent.Atr)}");
                //     break;
            }

            await SendMessage(sb.ToString());
            return sb.ToString();
        }

        private static string[] GetReaders()
        {
            var contextFactory = ContextFactory.Instance;
            using (var ctx = contextFactory.Establish(SCardScope.System))
            {
                return ctx.GetReaders();
            }
        }
    }
}