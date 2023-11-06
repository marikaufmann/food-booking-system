import React, { type Dispatch, type SetStateAction } from "react";
import { BsFillCartFill } from "react-icons/bs";
type CartItemProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: { id: string; quantity: number }[];
};
const CartItem = ({ setOpen, products }: CartItemProps) => {
  return (
    <div className="flex px-6 items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-xl bg-[#afb26e]/40 px-3 py-2 sm:text-lg font-medium text-[#101518] hover:bg-[#afb26e]/90 hover:text-[#101518]/90"
      >
				<BsFillCartFill className="mr-2 sm:text-lg" />
        {products.reduce((acc, item) => acc + item.quantity, 0)}
      </button>
    </div>
  );
};

export default CartItem;
