import { BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { modalConditions } from "../../../../models/modal";



const ProductAction = ({ setIsOpen }:modalConditions) => {
  

    return (
      <div className="flex justify-between">
        {/* select dropwdown */}
        <div className="dropdown">
          <select
            name="account"
            className="px-3 border-2 border-gray-200 bg-white py-3 ml-"
          >
            <option value="">All</option>
            <option value="">Active Verifiers</option>
            <option value="">Pending Verifiers</option>
            <option value="">Deactivated Verifiers</option>
          </select>
        </div>
        <div className="flex items-center">
          <div className="ml-5">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-3 flex items-center" 
            onClick={()=>setIsOpen()}>
              <FiPlus className="text-2xl inline mr-2" />
              <span>New Product</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
export default ProductAction