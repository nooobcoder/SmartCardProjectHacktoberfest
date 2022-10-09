using System;
using System.Collections.Generic;
using REST.Entities;

namespace REST.Repositories.Interfaces
{
    public interface IInMemItemsRepository
    {
        IEnumerable<Item> GetAll();
        Item GetItemById(Guid Id);
        void CreateItem(Item item);
        void UpdateItem(Item item);
        void DeleteItem(Guid id);
    }
}
