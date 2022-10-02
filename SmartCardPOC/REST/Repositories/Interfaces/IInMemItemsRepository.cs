using REST.Entities;
using System;
using System.Collections.Generic;

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