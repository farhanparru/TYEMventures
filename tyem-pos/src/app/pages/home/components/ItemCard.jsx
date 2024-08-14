import React from 'react';

const items = [
  { id: 1, name: 'CHICKEN SHAWARMA', price: '4 Prices' },
  { id: 2, name: 'GRILLED CHICKEN', price: '2 Prices' },
  { id: 3, name: 'HOT & SPICY ALFAHM', price: '2 Prices' },
  { id: 4, name: 'CDF', price: '2 Prices' },
  { id: 5, name: 'PEPPER ALFAHAM', price: '2 Prices' },
  { id: 6, name: 'DEJAJ HAAR (10PCS)', sku: 13, price: '₹340.00' },
  { id: 7, name: 'DEJAJ HERBS (8PCS)', sku: 14, price: '₹300.00' },
  { id: 8, name: 'MUSHAKKAL TAWA', sku: 15, price: '₹1,300.00' },
  { id: 9, name: 'CHICKEN TAWA', price: '2 Prices' },
  { id: 10, name: 'LAHAM TAWA MASHAWI (10PCS)', sku: 18, price: '₹550.00' },
  { id: 11, name: 'MUTTON RAN', sku: 19, price: '₹800.00' },
  { id: 12, name: 'MUTTON PEPPER TAWA (6PCS)', sku: 20, price: '₹370.00' },
  { id: 13, name: 'ROYAL SPECIAL TEA', price: 'Price' },
  { id: 14, name: 'ROYAL SPECIAL COFFEE', price: 'Price' },
];

const ItemCard = () => {
  return (
    <div className="grid grid-cols-3 p-4" style={{ gap: '13rem' }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-teal-600 text-black p-4 rounded-md shadow-md flex flex-col justify-between"
          style={{ width: '200px', height: '120px' }}
        >
          <h3 className="text-sm font-bold capitalize">{item.name}</h3>
          {item.sku && <p className="text-xs">SKU: {item.sku}</p>}
          <h3 className="text-md font-medium">{item.price}</h3>
        </div>
      ))}
    </div>
  );
};

export default ItemCard;
