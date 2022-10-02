using REST.Entities;
using REST.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace REST.Repositories
{
    public class InMemItemsRepository : IInMemItemsRepository
    {
        private readonly List<Item> items = new()
        {
            new Item{ Id=Guid.NewGuid(),Name="Potion", Price=9, CreatedDate=DateTimeOffset.UtcNow},
            new Item{ Id=Guid.NewGuid(),Name="Iron Sword", Price=20, CreatedDate=DateTimeOffset.UtcNow},
            new Item{ Id=Guid.NewGuid(),Name="Halo", Price=12, CreatedDate=DateTimeOffset.UtcNow},
            new Item{ Id=Guid.NewGuid(),Name="Bronze Shield", Price=18, CreatedDate=DateTimeOffset.UtcNow},
            new Item{ Id=Guid.NewGuid(),Name="Katana Kombat", Price=22, CreatedDate=DateTimeOffset.UtcNow}
        };

        public void CreateItem(Item item) { items.Add(item); }

        // Get all the items
        public IEnumerable<Item> GetAll()
        {
            return items;
        }

        // Find an item by id
        public Item GetItemById(Guid Id)
        {
            return items.Where(i => i.Id == Id).SingleOrDefault();
        }

        public void UpdateItem(Item item)
        {
            // Update item by id
            var index = items.FindIndex(existingItem => existingItem.Id == item.Id);
            items[index] = item;
        }
        public void DeleteItem(Guid id)
        {
            // Delete item by id
            var index = items.FindIndex(existingItem => existingItem.Id == id);
            items.RemoveAt(index);
        }
    }
}
