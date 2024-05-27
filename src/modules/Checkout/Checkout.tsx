import { Form, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode
} from "vn-local-plus";
import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";

function Checkout() {
  useTitle(SITE_MAP.CHECKOUT.title);
  const navigate = useNavigate();
  //const [provinces, setProvinces] = useState([]);
  //const [selectedProvince, setSelectedProvince] = useState();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{code:string}>({code:""});
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState<{code:string}>({code:""});
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  //console.log(getProvinces());
  // console.log(getDistricts(),getDistrictByCode("79"));

  // useEffect(() => {
  //   fetchProvinces();
  // }, []);
  // const fetchProvinces = async () => {
  //   const provincesData = await getProvinces();
  //   setProvinces(provincesData);
  // };

  const handleProvinceChange = (event: { target: { value: string } }) => {
    const selectedProvince = getProvinces().find(
      /* eslint-disable @typescript-eslint/no-explicit-any  */
      (province: any) => province.name === event.target.value
    );

    const districts: any = getDistrictsByProvinceCode(selectedProvince.code);

    setDistricts(districts);
  };

  const handleDistrictChange = (event: { target: { value: string } }) => {
    const selectedDistricts: any = districts.find(
      (district: any) => district.name === event.target.value
    );
    console.log(selectedDistricts);
    setSelectedDistrict(selectedDistricts);

    const ward: any = getWardsByDistrictCode(selectedDistricts.code);
    setWards(ward);
    // console.log(wards);
  };

  const handleWardChange = (event: { target: { value: string } }) => {
    const selectedWard: any = wards.find(
      (ward: any) => ward?.name === (event.target.value as string)
    );
    console.log(selectedWard);

    setSelectedWard(selectedWard);
  };
  const calculateShippingFee = async () => {
    try {
      const response = await fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "46d72744-fa69-11ee-8d6a-5276b526e4bb",
            shop_id: "5015217",
          },
          body: JSON.stringify({
            service_type_id: 5,
            service_id: null,
            insurance_value: 500000,
            coupon: null,
            from_district_id: 762,
            to_district_id: Number(selectedDistrict.code),
            to_ward_code: selectedWard?.code,
            height: 15,
            length: 15,
            weight: 1000,
            width: 15,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      setShippingFee(data.data.total);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10 h-[1000px]">
      <div className="ml-[183.5px]">
        <h1 className="text-[30px] text-[#E85353] font-semibold">CHECKOUT</h1>
        <p
          className="text-[20px] text-[#007bff] hover:text-red-500 hover:cursor-pointer"
          onClick={() => {
            navigate(SITE_MAP.SHOP.url);
          }}
        >
          Back to shop
        </p>
        <div className="flex justify-between">
          <div className="basis-2/3 ">
            <div>
              <input
                type="email"
                name=""
                id=""
                placeholder="Email"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9]
              transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Full name"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Phone number"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Address"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>

            <div>
              <select
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 "
                onChange={handleProvinceChange}
              >
                {/* eslint-disable @typescript-eslint/no-explicit-any  */}
                {getProvinces().map((province: any) => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 "
                onChange={handleDistrictChange}
              >
                {/* eslint-disable @typescript-eslint/no-explicit-any  */}
                {districts?.map((district: any) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 "
                onChange={handleWardChange}
              >
                {/* eslint-disable @typescript-eslint/no-explicit-any  */}
                {getWardsByDistrictCode(selectedDistrict.code)?.map((ward: any) => (
                  <option key={ward.id} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Note"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>

            <div>
              <h2 className="text-[30px]">Choose payment method</h2>
            </div>
            <div className="w-[80%]">
              <div
                className="flex flex-row items-center justify-between text-lg mt-4 p-3"
                style={{ border: "1px solid black", borderRadius: "12px" }}
              >
                <div className="my-5">
                  <p className="font-semibold">Pay later in cash</p>
                  <p className="mt-4">
                    Pay the full amount after completing the trip and it's done.
                  </p>
                </div>
                <div className="w-[40px] h-[30px]">
                  <input
                    className="bg-white w-full h-full"
                    style={{ borderWidth: "7px", borderColor: "black" }}
                    type="radio"
                    onChange={() => setPaymentMethod("cash")} // Khi chọn "Tiền mặt"
                    checked={paymentMethod === "cash"}
                  />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between text-lg mt-4 p-3"
                style={{ border: "1px solid black", borderRadius: "12px" }}
              >
                <div className="my-5">
                  <p className="font-semibold">Pay later by bank card</p>
                  <p className="mt-4">Pay the full amount by bank card.</p>
                </div>
                <div className="w-[40px] h-[30px]">
                  <input
                    className="bg-white w-full h-full"
                    style={{ borderWidth: "7px", borderColor: "black" }}
                    type="radio"
                    onChange={() => setPaymentMethod("bank")} // Khi chọn "Thẻ ngân hàng"
                    checked={paymentMethod === "bank"}
                  />
                </div>
              </div>
            </div>
            {paymentMethod === "bank" && (
              <div className="mt-4 w-[80%]">
                <h2 className="mb-4">Choose bank or visa card</h2>
                <Form.Item>
                  <Select placeholder="Thẻ tín dụng hoặc thẻ ghi nợ">
                    <Select.Option value="TPBANK">TP Bank</Select.Option>
                    <Select.Option value="PAYPAL">PayPal</Select.Option>
                    <Select.Option value="APPLEPAY">Apple Pay</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            )}

            <div className="flex justify-between items-center  mt-3">
              <button
                className="h-[42px] w-[80%] bg-[#E85353] text-white text-[20px] "
                onClick={() => {
                  calculateShippingFee();
                }}
              >
                PAY NOW
              </button>
            </div>
          </div>
          {/* ---- */}
          <div className="basis-1/3 sticky top-5 rounded-[24px]  min-h-[300px] bg-[#fff] border-solid border-[1px] border-[#cfcfcf] flex flex-col gap-5">
            {/* <h2 className="text-xl text-gray-500 font-semibold px-[10px] my-3">
              Cart (<span>1 </span>Item)
            </h2> */}

            <div>
              {/* <p className="relative top-3 left-[25%] bg-[#666] px-3 py-2 text-white rounded-full w-[33px]">
                1
              </p> */}
              <div className="flex flex-row items-center justify-between px-[10px]">
                <img
                  src="images/cake.png"
                  alt="hình sản phẩm"
                  className="w-[120px]  rounded-[10px]"
                />

                <div className="flex flex-col gap-3">
                  <p className="relative top-0 right-[120px] bg-[#666] px-3 py-2 text-white rounded-full w-[33px]">
                    1
                  </p>
                  <p className="text-[18px] text-[#123829] relative bottom-3 font-medium">
                    Cake
                  </p>
                  <p className="text-[15px] text-[#123829] relative bottom-3 font-light">
                    400g
                  </p>
                </div>

                <p className="text-[20px] ml-5 text-[#123829] font-light">
                  100$
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-[1px] w-[80%]  bg-[#c3bdbd]"></div>
            </div>
            <div className="flex justify-between mt-2 px-[10px]">
              <p className="text-[18px] font-light">Subtotal</p>
              <p className="text-[18px] text-[#123829]">100$</p>
            </div>
            <div className="flex justify-between mt-3 px-[10px]">
              <p className="text-[20px] font-light">Shipping</p>
              <p className="text-[20px] text-[#123829]">{shippingFee}$</p>
            </div>
            <div className="flex justify-center">
              <div className="h-[1px] w-[80%] my-3 bg-[#c3bdbd]"></div>
            </div>
            <div className="flex justify-between px-[10px]">
              <input
                type="text"
                placeholder="Apply promotion code"
                className="w-[285px] h-[42px] px-2 text-[20px] rounded-[5px] border border-stone-400"
              />
              <button className="h-[42px] w-[122px]   bg-[#357edb] flex justify-center items-center text-white  text-[18px] ">
                APPLY
              </button>
            </div>
            <div className="flex justify-between mt-5 px-[10px]">
              <p className="text-[23px]">Total</p>
              <p className="text-[25px] text-[#123829] font-semibold">100$</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
