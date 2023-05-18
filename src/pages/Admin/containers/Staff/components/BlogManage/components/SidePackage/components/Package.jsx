import { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { ic_plus_white } from '../../../../../../../../../assets';

// ** components
import Item from './Item';

// ** Redux
import { setContentBlog } from '../../../../../../../../../redux/actionSlice/managementSlice';
import { useDispatch, useSelector } from 'react-redux';

const Package = (props) => {
  // ** const
  const { handleKeyDown, handleRemovePackage, id, setDataPackageList } = props;
  const ingredientsStore = useSelector((state) => state.management?.blogContent?.ingredients);
  const dispatch = useDispatch();

  const [expectedTotalPrice, setExpectedTotalPrice] = useState(0);
  const [totalKcal, setTotalKcal] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [cookedPrice, setCookedPrice] = useState('');
  const [portion, setPortion] = useState('');
  const [ingredientList, setIngredientList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  // ** get placeholer item to edit
  useEffect(() => {
    // if (params.blogId) {
    let dataIngredient = ingredientsStore;
    if (dataIngredient.length > 0) {
      dataIngredient.forEach((item) => {
        handleAddItem(item);
      });
    }
    // }
  }, [ingredientsStore]);

  // ** handle calculate price and calories
  useEffect(() => {
    console.log(selectedList);
    let recipeDetails = selectedList?.map(function (item) {
      return {
        name: item.item.name,
        quantity: parseInt(item.amount),
        ingredientId: item.item.ingredientId,
        description: item.description,
        unitName: item.unitName,
      };
    });
    if (recipeDetails.length > 0) {
      // console.log(recipeDetails);
      setDataPackageList((prev) => [
        ...prev,
        {
          packageId: id,
          portion: portion,
          packagePrice: packagePrice,
          cookedPrice: cookedPrice,
          ingredientDetails: recipeDetails,
        },
      ]);
      // dispatch(setContentBlog({ ingredients: recipeDetails }));
    } else {
      // if (params.blogId) {
      //   dispatch(setContentBlog({ ingredients: recipeDetails }));
      // }
    }
    let expectedPrice = 0;
    let totalKcal = 0;
    selectedList.forEach((item) => {
      expectedPrice += item.item.price * item.amount;
      totalKcal += item.item.kcal * item.amount;
    });
    setExpectedTotalPrice(expectedPrice);
    if (totalKcal > 0) {
      setTotalKcal(totalKcal);
    }
  }, [selectedList]);

  // ** functs
  const handleAddItem = (editItem) => {
    setIngredientList((prev) => [...prev, { id: crypto.randomUUID(), editItem }]);
  };

  return (
    <div className="relative font-inter bg-[#FFDACA] w-fit mb-2 rounded-[10px] p-[20px]">
      <Tooltip title="Xóa gói nguyên liệu" placement="top">
        <button
          onClick={() => handleRemovePackage(id)}
          className="absolute top-5 right-5 p-1 ml-3 rounded-full bg-redError"
        >
          <img className="w-[20px] transform rotate-[45deg]" src={ic_plus_white} />
        </button>
      </Tooltip>
      {/*  */}
      <div className="sm:gap-10 mb-5">
        {/* portion, ingredient price, cooked price */}
        <div className="flex gap-3 items-center mb-5">
          <input
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            placeholder="Khẩu phần"
            className="font-bold rounded w-[120px] outline-none pl-2"
          />
          <input
            value={packagePrice}
            onChange={(e) => setPackagePrice(e.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            placeholder="Giá gói nguyên liệu"
            className="font-bold rounded w-[190px] outline-none pl-2"
          />
          <input
            value={cookedPrice}
            onChange={(e) => setCookedPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            type="number"
            placeholder="Giá đặt nấu"
            className="font-bold rounded w-[150px] outline-none pl-2"
          />
        </div>

        {/* pre price, total calo */}
        <div>
          <div className="mb-3 flex gap-2">
            <p className="text-[#898989]">Giá dự kiến</p>
            <p className="font-bold text-redError">{Intl.NumberFormat().format(expectedTotalPrice)}đ</p>
          </div>
          <div className="mb-3 flex md:flex-row flex-col gap-2">
            <p className="text-[#898989]">Tổng lượng calo</p>
            <input
              onKeyDown={handleKeyDown}
              type="number"
              value={totalKcal}
              onChange={(e) => setTotalKcal(e.target.value)}
              className="font-bold text-blue-500 rounded w-[150px] outline-none pl-2"
            ></input>
          </div>
          {/* {previousTotalKcal !== '' && (
            <i className="text-[#898989]">Tổng lượng calo đã điều chỉnh trước đó: {previousTotalKcal}</i>
          )} */}
        </div>
      </div>
      {/* ingredients */}
      {ingredientList?.length > 0 &&
        ingredientList?.map((item, i) => (
          <div key={item.id}>
            <Item
              editItem={item.editItem}
              id={item.id}
              index={i}
              handleKeyDown={handleKeyDown}
              data={item}
              // setSelectedPrice={setSelectedPrice}
              // selectedPrice={selectedPrice}
              setSelectedList={setSelectedList}
              selectedList={selectedList}
            />
          </div>
        ))}
    </div>
  );
};

export default Package;
