import { useState, useEffect } from 'react';
import instances from '../../../../../../../../utils/plugin/axios';

const RegionDropdown = () => {
  const [regions, setRegions] = useState();

  useEffect(() => {
    const fetch = async () => {
      const res = await instances.get('/region/dropdown-region');
      setRegions(res.data.result);
    };

    fetch();
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* <label>Vùng miền</label> */}
      <select
        className={`block mt-2 h-[47px] p-[12px] text-subText sm:text-md max-h-[100px] overflow-y-scroll border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
      >
        <option value="">Vùng miền</option>
        {regions &&
          regions.map((region) => (
            <option key={region.regionId} value={region.regionId}>
              {region.regionName}
            </option>
          ))}
      </select>
    </div>
  );
};

export default RegionDropdown;
