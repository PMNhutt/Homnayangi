import { useEffect, useState } from 'react';
import { Regex_PhoneNumber, ReGex_VietnameseTitle } from '../../../../utils/regex';
import instances from '../../../../utils/plugin/axios';
import GMapAutoComplete from './GMapAutoComplete';
import MapPicker from 'react-google-map-picker';
import GoongAutoComplete from './GoongAutoComplete';

import { setCartAddress } from '../../../../redux/actionSlice/shoppingCartSlice';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const AddressForm = (props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const DefaultLocation = { lat: 10.75, lng: 106.67 };
  // ** notify
  const notifyConfirmAddress = () =>
    toast.success('Đã xác nhận địa chỉ !', {
      pauseOnHover: false,
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: props.userInfo });
  const dispatch = useDispatch();
  const [activeDistricts, setActiveDistricts] = useState('');
  const [districts, setDistricts] = useState([]);
  const [activeProvinces, setActiveProvinces] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [activeWards, setActiveWards] = useState('');
  const [wards, setWards] = useState([]);
  const [checkedAddress, setCheckedAddress] = useState(true);
  const [mapAddress, setMapAddress] = useState('');
  const [mapAddressError, setMapAddressError] = useState(false);
  const [bounds, setBounds] = useState();
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(15);

  // ** submit form
  const onSubmit = (data) => {
    if (mapAddress !== '') {
      const address =
        data.unique_name +
        ', ' +
        data.PhoneNumber +
        ', ' +
        data.email +
        ', ' +
        mapAddress +
        ', ' +
        // data.districts +
        // ', ' +
        // data.wards +
        // ', ' +
        data.description;
      dispatch(setCartAddress(address));
      notifyConfirmAddress();
      setMapAddressError(false);
    } else {
      setMapAddressError(true);
    }
  };

  // ** get district, wards
  useEffect(() => {
    const fetch = async () => {
      const res = await instances.get('/orders/local');
      setDistricts(res.data);
    };

    fetch();
  }, []);

  // ** get ward base on district
  useEffect(() => {
    // console.log(activeWards);
    if (activeDistricts !== '') {
      setActiveWards('');
      const fetch = async () => {
        const res = await instances.get(`/orders/local/${activeDistricts}`);
        setWards(res.data);
      };

      fetch();
    }
  }, [activeDistricts]);

  // ** get Lat, Lng coords bound
  useEffect(() => {
    if (activeWards !== '') {
      const getCoords = async () => {
        const res2 = await getGeocode({ address: activeWards + ', ' + activeDistricts + ',Thành phố Hồ Chí Minh' });
        // console.log(res2[0].geometry.bounds);
        const latlng2 = await getLatLng(res2[0]);
        // console.log(latlng2);
        setDefaultLocation(latlng2);
        // console.log(res2.find((loca) => loca.geometry?.bounds).geometry.bounds);
        setBounds(res2.find((loca) => loca.geometry?.bounds).geometry.bounds);
      };
      getCoords();
    }
  }, [activeWards]);

  // ** functions
  const handleChangeProvinces = (event) => {
    // console.log(event.target.value);
    setActiveProvinces(event.target.value);
  };

  const handleChangeDistricts = (event) => {
    // console.log(event.target);
    setActiveDistricts(event.target.value);
  };

  const handleChangeWards = (event) => {
    // console.log(event.target.value);
    setActiveWards(event.target.value);
  };

  const handleChangeAddress = (event) => {
    setCheckedAddress(event.target.checked);
  };

  const handleChangeLocation = (lat, lng) => {
    setLocation({ lat: lat, lng: lng });
  };

  const handleChangeZoom = (newZoom) => {
    setZoom(newZoom);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="address-form"
        //  onBlur={handleSubmit(onSubmit)}
      >
        {/* name */}
        <input
          name="unique_name"
          placeholder="Họ và tên"
          className={`block w-full h-[47px] ${
            errors?.unique_name ? 'mb-[5px]' : 'mb-[20px]'
          } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
          {...register('unique_name', {
            required: true,
            pattern: {
              value: ReGex_VietnameseTitle,
            },
          })}
        />
        {errors?.unique_name?.type === 'required' && (
          <p className="mb-[5px] text-redError text-[14px]">Họ và tên không được trống</p>
        )}
        {errors?.unique_name?.type === 'pattern' && (
          <p className="mb-[5px] text-redError text-[14px]">Họ và tên không hợp lệ</p>
        )}
        {/* phone number and email */}
        <div className="sm:flex items-center gap-3 justify-between">
          {/* phonenumber */}
          <div className="flex-1">
            <input
              type="number"
              name="PhoneNumber"
              placeholder="Số điện thoại"
              className={`block w-full h-[47px] ${
                errors?.PhoneNumber ? 'mb-[5px]' : 'mb-[20px]'
              } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
              {...register('PhoneNumber', {
                required: true,
                minLength: 10,
                maxLength: 11,
                pattern: {
                  value: Regex_PhoneNumber,
                },
              })}
            />
            {errors?.PhoneNumber?.type === 'required' && (
              <p className="mb-[5px] text-redError text-[14px]">Số điện thoại không được trống</p>
            )}
            {(errors?.PhoneNumber?.type === 'maxLength' ||
              errors?.PhoneNumber?.type === 'minLength' ||
              errors?.PhoneNumber?.type === 'pattern') && (
              <p className="mb-[5px] text-redError text-[14px]">Số điện thoại không hợp lệ</p>
            )}
          </div>
          {/* email */}
          <div className="flex-1">
            <input
              name="email"
              placeholder="Email"
              className={`block w-full h-[47px] ${
                errors?.email ? 'mb-[5px]' : 'mb-[20px]'
              } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
              {...register('email', {
                // required: true,
                // pattern: {
                //   value: ReGex_VietnameseTitle,
                // },
              })}
            />
            {errors?.email?.type === 'required' && (
              <p className="mb-[5px] text-redError text-[14px]">Email không được trống</p>
            )}
            {errors?.email?.type === 'pattern' && (
              <p className="mb-[5px] text-redError text-[14px]">Email không hợp lệ</p>
            )}
          </div>
        </div>
        {/* city, provinces, wrad */}
        <div className="sm:flex items-center gap-3 justify-between">
          {/* provinces  */}
          {/* <div className="flex-1">
                    <Select
                      MenuProps={MenuProps}
                      value={activeProvinces}
                      onChange={handleChangeProvinces}
                      displayEmpty
                      renderValue={
                        activeProvinces !== '' ? undefined : () => <p className="text-[#898989]">Chọn tỉnh/thành</p>
                      }
                      inputProps={{ ...register('provinces', { required: true }) }}
                      className={`block w-full h-[47px] ${
                        errors?.provinces ? 'mb-[5px]' : 'mb-[20px]'
                      } p-[12px] text-subText sm:text-md  border rounded-[5px] focus:outline-primary`}
                    >
                      {provinces.length > 0 ? (
                        provinces.map((item, i) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <em>Chưa có dữ liệu</em>
                        </MenuItem>
                      )}
                    </Select>
                    {errors?.provinces?.type === 'required' && (
                      <p className="mb-[5px] text-redError text-[14px]">Vui lòng chọn tỉnh/thành của bạn</p>
                    )}
                  </div> */}
          {/* districts  */}
          {/* <div className="flex-1">
            <Select
              MenuProps={MenuProps}
              value={activeDistricts}
              onChange={handleChangeDistricts}
              displayEmpty
              renderValue={activeDistricts !== '' ? undefined : () => <p className="text-[#898989]">Chọn quận/huyện</p>}
              inputProps={{
                ...register('districts', { required: true }),
              }}
              className={`block w-full h-[47px] ${
                errors?.districts ? 'mb-[5px]' : 'mb-[20px]'
              } p-[12px] text-subText sm:text-md  border rounded-[5px] focus:outline-primary`}
            >
              {districts.length > 0 ? (
                districts.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <em>Chưa có dữ liệu</em>
                </MenuItem>
              )}
            </Select>
            {errors?.districts?.type === 'required' && (
              <p className="mb-[5px] text-redError text-[14px]">Vui lòng chọn tỉnh/thành của bạn</p>
            )}
          </div> */}
          {/* wards  */}
          {/* <div className="flex-1">
            <Select
              MenuProps={MenuProps}
              value={activeWards}
              onChange={handleChangeWards}
              displayEmpty
              renderValue={activeWards !== '' ? undefined : () => <p className="text-[#898989]">Chọn phường/xã</p>}
              inputProps={{
                ...register('wards', { required: true }),
              }}
              className={`block w-full h-[47px] ${
                errors?.wards ? 'mb-[5px]' : 'mb-[20px]'
              } p-[12px] text-subText sm:text-md  border rounded-[5px] focus:outline-primary`}
            >
              {wards.length > 0 ? (
                wards.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <em>Chưa có dữ liệu</em>
                </MenuItem>
              )}
            </Select>
            {errors?.wards?.type === 'required' && (
              <p className="mb-[5px] text-redError text-[14px]">Vui lòng chọn tỉnh/thành của bạn</p>
            )}
          </div> */}
        </div>
        <div className="relative">
          {/* <GMapAutoComplete bounds={bounds} setMapAddress={setMapAddress} mapAddressError={mapAddressError} /> */}
          <GoongAutoComplete setMapAddress={setMapAddress} mapAddressError={mapAddressError} />
          {mapAddressError && <p className="mb-[5px] text-redError text-[14px]">Địa chỉ nhận hàng không được trống</p>}
          {/* specific address */}
          {/* <input
            name="specific_address"
            value={mapAddress?.label}
            placeholder="Địa chỉ nhận hàng"
            className={`opacity-[0] w-full h-[47px] ${
              errors?.specific_address ? 'mb-[5px]' : 'mb-[20px]'
            } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
            {...register('specific_address', {
              required: true,
              // pattern: {
              //   value: ReGex_VietnameseTitle,
              // },
            })}
          /> */}
          {/* {errors?.specific_address?.type === 'required' && (
            <p className="mb-[5px] text-redError text-[14px]">Địa chỉ nhận hàng không được trống</p>
          )}
          {errors?.specific_address?.type === 'pattern' && (
            <p className="mb-[5px] text-redError text-[14px]">Địa chỉ nhận hàng không hợp lệ</p>
          )} */}
          {/* google suggest address */}
          {/* <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_MAP_API}
            apiOptions={{ language: 'vi', region: 'vn' }}
            autocompletionRequest={{
              componentRestrictions: {
                country: ['vn'],
              },
              bounds: bounds,
              // location: { lat: 10.8671531, lng: 106.6413322 },
              radius: 1000,
            }}
            selectProps={{
              value: mapAddress,
              onChange: (e) => setMapAddress(e),
              placeholder: 'Địa chỉ nhận hàng',
              noOptionsMessage: () => 'Hãy nhập địa chỉ',
              isDisabled: bounds ? false : true,
              styles: {
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: '#B9B9B9',
                  height: '47px',
                  width: '100%',
                  outline: '#FF8855',
                  paddingLeft: '5px',
                  marginBottom: `${mapAddressError ? '5px' : '20px'}`,
                }),
              },
            }}
          />
          {mapAddressError && <p className="mb-[5px] text-redError text-[14px]">Địa chỉ nhận hàng không được trống</p>} */}
        </div>
        {bounds && (
          <div className="mb-3">
            <>
              <p className="my-2">Chọn địa chỉ cụ thể</p>
              <MapPicker
                defaultLocation={defaultLocation}
                zoom={zoom}
                mapTypeId="roadmap"
                style={{ height: '300px' }}
                onChangeLocation={handleChangeLocation}
                onChangeZoom={handleChangeZoom}
                apiKey={import.meta.env.VITE_MAP_API}
              />
            </>
          </div>
        )}

        {/* note */}
        <textarea
          name="description"
          placeholder="Ghi chú"
          // onBlur={(e) => props?.handleInputNote(e.target.value)}
          rows="4"
          className="p-2.5 w-full text-subText bg-white border-[2px] rounded border-[#d2d2d2]
            focus:outline-none focus:bg-white focus:border-[2px] focus:border-primary resize-none"
          {...register('description', {
            // required: true,
          })}
        ></textarea>
        {errors?.description?.type === 'required' && (
          <p className="mb-[5px] text-redError text-[14px]">Mô tả không được trống</p>
        )}

        {/* confirm button */}
        <div className="w-full flex justify-end">
          <button type="submit" className="bg-primary mt-2 px-5 py-2 text-white font-medium rounded-[5px]">
            Xác nhận địa chỉ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
