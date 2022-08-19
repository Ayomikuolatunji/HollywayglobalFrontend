import { BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { modalConditions } from "../../../../models/modal";



const ProductAction = ({ setIsOpen }:modalConditions) => {
  

    return (
      <div className="flex justify-end">
        {/* select dropwdown */}
        <div className="flex items-center">
          <div className="ml-5">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-2 flex items-center" 
            onClick={()=>setIsOpen(true)}>
              <FiPlus className="text-2xl inline mr-2" />
              <span>New Product</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
export default ProductAction