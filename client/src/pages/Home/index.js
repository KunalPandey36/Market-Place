import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetProducts } from '../../apicalls/products'
import { Input, message } from 'antd'
import { SetLoader } from '../../redux/loadersSlice'
import Divider from '../../components/Divider'
import { useNavigate } from 'react-router-dom'
import Filters from './Filters'
import Search from 'antd/es/input/Search'



function Home() {
  const { user } = useSelector((state) => state.users);
  const [showFilters, setShowFilters] = React.useState(true);
  const [products, setProducts] = React.useState([])
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    status: "approved",
    category:[],
    age:[],
  }
  )
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }

    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }
  

  React.useEffect(() => {
    getData();
  }, [filters])
  

  return (
    <div className='flex gap-5'>
      {showFilters && <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters} />}
      <div className='flex flex-col gap-5 w-full'>
        <div className='flex gap-5 items-center'>
          {!showFilters &&
            <i className="ri-filter-3-line cursor-pointer text-2xl"
              onClick={() => setShowFilters(!showFilters)}></i>
          }
          <Input type='text' placeholder='Search Product here...' className='border border-gray-300 rounded border-solid w-full p-2 h-14' />

        </div>
        <div className={`grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}`}>
          {products?.map((product) => {
            return <div className='border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer'
              key={product.id}
              onClick={() => {
                navigate(`/product/${product._id}`)
              }
              }>
              <img src={product.images[0]} className='w-full h-52 rounded-md p-2' alt='' />

              <div className='px-2 flex flex-col gap-1'>
                <h1 className='text-lg font-semibold'>{product.name}</h1>
                <p className='text-sm text-gray-500'>{product.description}</p>
                <Divider />
                <span className='text-xl font-semibold text-green-700'>
                  Rs {product.price}
                </span>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>

  )
}

export default Home