import React from 'react';
import { Regex_PhoneNumber, ReGex_VietnameseTitle } from '../../../../utils/regex';
import { useForm } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: props.userInfo });

  // ** submit form
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {/* phone number */}
        <input
          type="number"
          name="phonenumber"
          placeholder="Số điện thoại"
          className={`block w-full h-[47px] ${
            errors?.phonenumber ? 'mb-[5px]' : 'mb-[20px]'
          } p-[12px] text-subText sm:text-md  border border-[#B9B9B9] rounded-[5px] focus:outline-primary`}
          {...register('phonenumber', {
            required: true,
            minLength: 10,
            maxLength: 11,
            pattern: {
              value: Regex_PhoneNumber,
            },
          })}
        />
        {errors?.phonenumber?.type === 'required' && (
          <p className="mb-[5px] text-redError text-[14px]">Số điện thoại không được trống</p>
        )}
        {(errors?.phonenumber?.type === 'maxLength' ||
          errors?.phonenumber?.type === 'minLength' ||
          errors?.phonenumber?.type === 'pattern') && (
          <p className="mb-[5px] text-redError text-[14px]">Số điện thoại không hợp lệ</p>
        )}
      </form>
    </div>
  );
};

export default AddressForm;
