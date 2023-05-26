import { useEffect, useState } from 'react';
import { goong } from '../../../../utils/plugin/axios';
import useDebounce from '../../../../share/hooks/useDebounce';

const GoongAutoComplete = (props) => {
  const { bounds, setMapAddress, mapAddressError } = props;
  const HCMLocation = '10.75, 106.67';
  const [searchValue, setSearchValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const searchDebounce = useDebounce(searchValue, 600);
  const [allowSearch, setAllowSearch] = useState(true);

  const handleInput = (e) => {
    setSearchValue(e.target.value);
    setAllowSearch(true);
  };

  const handleSelect = async (id) => {
    const res = await goong.get('/Place/Detail', {
      params: {
        place_id: id,
        api_key: import.meta.env.VITE_MAP_API,
      },
    });
    if (res.data.status == 'OK') {
      // console.log(res.data.result);
      setSearchValue(res.data.result.formatted_address);
      setAllowSearch(false);
      setPredictions([]);
      let suggestAddress = res.data.result.formatted_address;
      setMapAddress(suggestAddress.replace(/,/g, ''));
      console.log(res.data.result.geometry.location);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await goong.get(`/Place/AutoComplete`, {
        params: {
          api_key: import.meta.env.VITE_MAP_API,
          location: HCMLocation,
          more_compound: true,
          input: searchDebounce,
        },
      });
      if (res.data.status == 'OK') {
        setPredictions(res.data.predictions);
      } else {
        setPredictions([]);
      }
    };

    if (allowSearch) {
      fetch();
    }
  }, [searchDebounce, allowSearch]);

  return (
    <div className="relative">
      <input
        onBlur={() => {
          setSearchValue('');
          setMapAddress('');
        }}
        value={searchValue}
        onChange={handleInput}
        // disabled={!ready}
        // disabled={ready ? (bounds ? false : true) : true}
        placeholder="Địa chỉ nhận hàng"
        className={` w-full h-[47px] ${
          mapAddressError ? 'mb-[5px]' : 'mb-[20px]'
        } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
      />
      {predictions?.length > 0 && (
        <ul className="bg-white shadow-md absolute z-20 w-full top-12 rounded-[5px]">
          {predictions?.map((item) => (
            <li
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
              key={item.place_id}
              onClick={() => handleSelect(item.place_id)}
            >
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoongAutoComplete;
