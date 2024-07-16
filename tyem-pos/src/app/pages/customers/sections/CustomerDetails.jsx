import React from 'react'

const CustomerDetails = ({selectedCustomer}) => {

    const getDetailTiles = ()=>{
         const tiles = [];
        const keys = Object.keys(selectedCustomer);
        keys.map((key,index)=>{
             const bgClass = index%2===0 ? "bg-gray-100" : "bg-transperent"
            tiles.push(<CustomerDetailTile bgClass={bgClass} keyName={key} value={selectedCustomer[key]} key={key} />)
        })
       
        return tiles;
    }

  return (
    <div className={`flex flex-col gap-3 bg-white p-3 rounded-xl overflow-y-scroll w-full':'w-[40%]'}`}>
        <h2 className="text-2xl font-bold mb-8">Customer Details</h2>
        {selectedCustomer && getDetailTiles()}
    </div>
  )

  }
export default CustomerDetails



const CustomerDetailTile = ({keyName,value,bgClass}) => {
  
    return (
        <div  className={`flex gap-5 w-full items-center p-5 rounded-xl transition-all ${bgClass??"bg-gray-100"} `}>
                    <div className="flex-1">
                        <h2 className={`text-lg font-bold `}>{keyName}</h2>
                        <p className={`text-sm font-medium  text-gray-500`}>{value}</p>

                        </div>
                        </div>
    )
}