using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using REST.Controllers;
using REST.Repositories.Interfaces;

namespace REST.Tests.Controllers
{
    [TestClass]
    public class CardReaderControllerTest
    {
        [TestMethod]
        public void GetReaders()
        {
            // Arrange
            // Mock
            var mockRepository = new Mock<IInMemCardReaderRepository>();
            //mockRepository.Setup(x => x.GetCardReaders()).Returns(new Dictionary<string, string>[] { new Dictionary<string, string>() { { "reader_name", "Test Card Reader" } } });
            var controller = new CardReaderController(mockRepository.Object);

            // Act
            var result = controller.GetReaders();

            // Assert
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetReaders_NoReaders()
        {
            // Arrange
            // Mock
            var mockRepository = new Mock<IInMemCardReaderRepository>();
            //mockRepository.Setup(x => x.GetCardReaders()).Returns(System.Array.Empty<Dictionary<string, string>>());
            var controller = new CardReaderController(mockRepository.Object);

            // Act
            var result = controller.GetReaders();

            // Assert
            Assert.IsNotNull(result);
        }
    }
}
