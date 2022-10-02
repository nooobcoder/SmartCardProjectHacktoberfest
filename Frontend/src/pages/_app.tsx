import App, { AppContext, AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { Cookies, CookiesProvider } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import useWebSocket from 'react-use-websocket';

import '@/styles/globals.css';
import 'nprogress/nprogress.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { WEBSOCKET_URL } from '@/utils/consts';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Types for MyApp props
type MyAppProps = AppProps & {
  cookies: string;
};
function MyApp({ Component, pageProps, cookies }: MyAppProps) {
  // Disable React DevTools in production
  // if (process.env.NODE_ENV === 'production') {
  // }

  // DOCUMENTATION: https://github.com/robtaussig/react-use-websocket#readme
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [socketUrl, setSocketUrl] = useState(WEBSOCKET_URL);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [messageHistory, setMessageHistory] = useState([]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { sendMessage, lastMessage, readyState, lastJsonMessage } =
    useWebSocket(socketUrl, {
      retryOnError: true,
      reconnectInterval: 3000,
      shouldReconnect: (_closeEvent) => true,
    });

  useEffect(() => {
    if (lastMessage !== null) {
      toast.success(`${lastMessage.data}`, {
        position: 'bottom-right',
      });
      // setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('wss://localhost:5001/ws'),
  //   []
  // );

  // const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  const isBrowser = typeof window !== 'undefined';

  return (
    <CookiesProvider cookies={isBrowser ? undefined : new Cookies(cookies)}>
      <Component {...pageProps} key='app-root' />
      <Toaster
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </CookiesProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, cookies: appContext.ctx.req?.headers?.cookie };
};
