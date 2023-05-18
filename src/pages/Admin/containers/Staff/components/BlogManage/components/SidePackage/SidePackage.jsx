import { useState, useEffect } from 'react';

// ** Redux
import { setContentBlog } from '../../../../../../../../redux/actionSlice/managementSlice';
import { useDispatch, useSelector } from 'react-redux';

// ** Assets
import { ic_plus_white } from '../../../../../../../../assets';

// ** components
import Item from './components/Item';
import Package from './components/Package';

const SidePackage = () => {
  // ** consts
  const ingredientsStore = useSelector((state) => state.management?.blogContent?.ingredients);
  const dispatch = useDispatch();

  const [packageList, setPackageList] = useState([]);
  const [dataPackageList, setDataPackageList] = useState([]);

  // ** check root package length
  useEffect(() => {
    if (!ingredientsStore?.length > 0) {
      setPackageList([]);
    }
  }, [ingredientsStore]);

  useEffect(() => {
    console.log(dataPackageList);
  }, [dataPackageList]);

  // ** functions
  const handleAddPackage = (editItem) => {
    setPackageList((prev) => [...prev, { id: crypto.randomUUID(), editItem }]);
  };

  const handleRemovePackage = (id) => {
    setPackageList((current) => current.filter((item) => item.id !== id));
    setDataPackageList((current) => current.filter((item) => item.packageId !== id));
  };

  const handleKeyDown = (e) => {
    if (
      e.keyCode === 69 ||
      e.keyCode === 190 ||
      e.keyCode === 110 ||
      e.keyCode === 107 ||
      e.keyCode === 109 ||
      e.keyCode === 189 ||
      e.keyCode === 231
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="mt-5">
      {packageList?.length > 0 ? (
        <>
          {packageList.map((item, i) => (
            <div key={item.id}>
              <Package
                editItem={item.editItem}
                id={item.id}
                index={i}
                handleKeyDown={handleKeyDown}
                handleRemovePackage={handleRemovePackage}
                setDataPackageList={setDataPackageList}
                // setSelectedPrice={setSelectedPrice}
                // selectedPrice={selectedPrice}
                // setSelectedList={setSelectedList}
                // selectedList={selectedList}
              />
            </div>
          ))}
          <button
            disabled={ingredientsStore?.length > 0 ? false : true}
            onClick={() => handleAddPackage()}
            className={`${
              ingredientsStore?.length > 0 ? 'bg-green-500' : 'cursor-not-allowed bg-green-300'
            }  font-medium text-white flex gap-1 items-center px-4 py-2 rounded-[10px]`}
          >
            Thêm gói nguyên liệu <img className="w-[20px]" src={ic_plus_white} />
          </button>
        </>
      ) : (
        <button
          disabled={ingredientsStore?.length > 0 ? false : true}
          onClick={() => handleAddPackage()}
          className={`${
            ingredientsStore?.length > 0 ? 'bg-green-500' : 'cursor-not-allowed bg-green-300'
          }  font-medium text-white flex gap-1 items-center px-4 py-2 rounded-[10px]`}
        >
          Thêm gói nguyên liệu <img className="w-[20px]" src={ic_plus_white} />
        </button>
      )}
    </div>
  );
};

export default SidePackage;
