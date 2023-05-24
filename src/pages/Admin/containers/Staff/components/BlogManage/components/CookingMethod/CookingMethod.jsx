import { useState, useEffect } from 'react';
import instances from '../../../../../../../../utils/plugin/axios';

const CookingMethod = () => {
  const [cookingMethods, setCookingMethods] = useState();

  useEffect(() => {
    const fetch = async () => {
      const res = await instances.get('/cookingmethod/dropdown-cooking-method');
      setCookingMethods(res.data.result);
    };

    fetch();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <select
        className={`block mt-2 h-[47px] p-[12px] text-subText sm:text-md max-h-[100px] overflow-y-scroll border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
      >
        <option value="">Phương thức nấu</option>
        {cookingMethods &&
          cookingMethods.map((method) => (
            <option key={method.cookingMethodId} value={method.cookingMethodId}>
              {method.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CookingMethod;
