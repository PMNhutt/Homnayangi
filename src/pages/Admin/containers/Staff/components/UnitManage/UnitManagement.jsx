import { useState, useEffect } from 'react';
import instances from '../../../../../../utils/plugin/axios';

// **Assets
import { ic_blog_create } from '../../../../../../assets';

// ** Components
import DataTable from './components/DataTable';
import ConfirmModal from '../../../../../../share/components/Admin/ConfirmModal';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UnitManagement = () => {
  // ** Const
  const navigate = useNavigate();
  const [methods, setMethod] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [confirmData, setConfirmData] = useState();
  const [loading, setLoading] = useState(false);

  // ** Call api
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await instances.get('/cookingmethod');
      // console.log(res.data);
      setLoading(false);
      setMethod(res.data);
    };
    fetch();
  }, [updateTable]);

  // ** Func
  const handleOpenEdit = (data) => {
    navigate(`/management/method/edit/${data?.cookingMethodId}`);
  };

  const handleOpenDelete = (data) => {
    setIsShowModal(true);
    setConfirmData(data);
  };

  const handleConfirmDelete = () => {
    // console.log(confirmData?.unitId);
    toast.promise(
      instances.delete(`/cookingmethod/${confirmData?.cookingMethodId}`).then(() => {
        setUpdateTable((prev) => !prev);
        setIsShowModal(false);
      }),
      {
        pending: 'Đang xóa phương thức',
        success: 'Đã xóa thành công! 👌',
        error: 'Xóa phương thức thất bại',
      },
    );
  };
  const handleConfirmRestore = () => {
    toast.promise(
      instances
        .put(`/cookingmethod`, {
          cookingMethodId: confirmData?.cookingMethodId,
          cookingMethodName: confirmData?.cookingMethodName,
          status: true,
        })
        .then((res) => {
          setUpdateTable((prev) => !prev);
          setIsShowModal(false);
        }),
      {
        pending: 'Đang phục hồi',
        success: 'Đã phục hồi thành công! 👌',
        error: {},
      },
    );
  };

  return (
    <div>
      {isShowModal && (
        <ConfirmModal
          setIsShowModal={setIsShowModal}
          data={confirmData}
          modalTitle="Phương thức nấu ăn"
          statusTypeAvai={true}
          statusTypeNotAvai={false}
          setUpdateTable={setUpdateTable}
          itemName={confirmData?.name}
          handleConfirmDelete={handleConfirmDelete}
          handleConfirmRestore={handleConfirmRestore}
        />
      )}
      <div className="flex ss:flex-row flex-col gap-4 item-center mb-[20px]">
        <button
          onClick={() => navigate('/management/method/new')}
          className="flex items-center w-fit gap-2 py-2 px-3 bg-primary text-white font-medium rounded-[10px]"
        >
          Thêm phương thức nấu
          <img src={ic_blog_create} />
        </button>
      </div>
      <div>
        <DataTable
          methods={methods}
          handleOpenEdit={handleOpenEdit}
          handleOpenDelete={handleOpenDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UnitManagement;
