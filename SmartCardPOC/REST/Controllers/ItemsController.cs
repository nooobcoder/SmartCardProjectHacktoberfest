using Microsoft.AspNetCore.Mvc;
using REST.Dtos;
using REST.Entities;
using REST.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace REST.Controllers
{
    // GET /items
    [ApiController]
    [Route("items")]
    public class ItemsController : ControllerBase
    {
        private readonly IInMemItemsRepository _repository;

        public ItemsController(IInMemItemsRepository repository)
        {
            _repository = repository;
        }

        // GET /items
        [HttpGet]
        public IEnumerable<ItemDto> GetItems()
        {
            var items = _repository.GetAll().Select(item => item.AsDto());
            return items.OrderByDescending(item => item.Price);
        }

        [HttpGet("{id}")]
        public ActionResult<ItemDto> GetItem(Guid id) // The ActionResult type facilitates returning value of more than one distinct/non-distinct types.
        {
            // ActionResult -> https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.actionresult-1?f1url=%3FappId%3DDev16IDEF1%26l%3DEN-US%26k%3Dk(Microsoft.AspNetCore.Mvc.ActionResult%25601)%3Bk(DevLang-csharp)%26rd%3Dtrue&view=aspnetcore-6.0
            var item = _repository.GetItemById(id);
            if (item is null)
                return NotFound();

            return Ok(item.AsDto());
        }

        // POST /items
        [HttpPost]
        public ActionResult<ItemDto> CreateItem(CreateItemDto itemDto)
        {
            Item item = new()
            {
                Id = Guid.NewGuid(),
                Name = itemDto.Name,
                Price = itemDto.Price,
                CreatedDate = DateTimeOffset.UtcNow,
            };

            _repository.CreateItem(item);

            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item.AsDto());
        }

        // PUT /items/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateItem(Guid id, UpdateItemDto itemDto)
        {
            var existingItem = _repository.GetItemById(id);
            if (existingItem is null)
                return NotFound();

            Item updatedItem = existingItem with
            {
                Name = itemDto.Name,
                Price = itemDto.Price,
            };

            _repository.UpdateItem(updatedItem);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteItem(Guid id)
        {
            var existingItem = _repository.GetItemById(id);
            if (existingItem is null)
                return NotFound();

            _repository.DeleteItem(id);

            return NoContent();
        }
    }
}
