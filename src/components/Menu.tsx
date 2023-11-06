import Image from "next/image";
import React, {
  useState,
  type Dispatch,
  type SetStateAction,
  Fragment,
} from "react";
import { api } from "~/utils/api";
import CartItem from "./CartItem";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { format, parseISO} from "date-fns";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { capitalize, selectOptions } from "../utils/helper";
type MenuProps = {
  selectedTime: string;
  addToCart: (id: string, quantity: number) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: { id: string; quantity: number }[];
};
const Menu = ({ selectedTime, addToCart, setOpen, products }: MenuProps) => {
  const mealType = () => {
    let meal;
    const hours = parseISO(selectedTime).getHours();
    if (8 <= hours && hours <= 11) {
      meal = "breakfast";
    } else if (12 <= hours && hours <= 17) {
      meal = "lunch";
    } else {
      meal = "dinner";
    }

    return meal;
  };
  const { data: menuItems } = api.menu.getMenuItems.useQuery();
  const router = useRouter();
  const [filter, setFilter] = useState<string>(mealType());
  const filteredItems = menuItems?.filter((menuItem) => {
    return menuItem.categories.includes(filter);
  });

  return (
    <div className="relative">
      <div className="absolute right-3 top-2 z-10 sm:right-5 ">
        <Image
          src="/logo.png"
          alt="logo"
          width={70}
          height={70}
          className="object-contain"
        />
      </div>
      <div className="relative flex h-[400px] w-full items-center justify-center">
        <Image
          src="/menu.jpg"
          alt="menu background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute h-full w-full bg-black/60"></div>
        <div className="z-10 flex flex-col items-center justify-center p-2 text-center">
          <p className="font-shadows text-lg text-white ">we offer you</p>
          <h1 className="mt-2 max-w-md font-sans text-3xl font-[900] leading-tight tracking-wider  text-white sm:max-w-2xl sm:text-5xl">
            Fresh Ingredients, Tasty Meals & True Flavour
          </h1>
          <AnchorLink
            href="#menu"
            className="mt-6 border border-white px-7 py-2 font-sans text-white hover:bg-white/10 "
          >
            Order Now
          </AnchorLink>
        </div>
      </div>
      <div>
        <div className="ml-5 flex items-center justify-between mt-4 ">
          <div className="flex items-center gap-4 text-lg">
            <div className="rounded-full bg-white p-2 hover:bg-white/50">
              <HiArrowLeft
                className="cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>
            <h2 className=" w-full font-[400] text-[#101518]">
              On our menu for {format(parseISO(selectedTime), "MMMM do, yyyy")}
            </h2>
          </div>
					<CartItem setOpen={setOpen} products={products} />
        </div>
        <>
				<div className="flex items-center justify-between mr-5">

          <h2 className="mb-4 ml-5 mt-7  text-3xl font-[700] tracking-wide ">
            {capitalize(filter)}{" "}
            {filter === "breakfast"
              ? "🍳"
              : filter === "lunch"
              ? "🍲"
              : filter === "dinner"
              ? "🥘"
              : filter === "desserts"
              ? "🍰"
              : "☕️"}{" "}
          </h2>
					<select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            className="w-[150px] rounded-lg border border-[#afb26e] bg-white p-2 text-[#101518] outline-[#afb26e] md:w-[200px]"
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
				</div>
          <div
            id="menu"
            className="m-auto grid max-w-7xl grid-cols-1 items-center gap-5  p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredItems?.map((item) => (
              <div
                key={item.id}
                className="relative m-auto  flex h-[380px] w-full flex-col items-center gap-1 rounded-md bg-white p-2 shadow-lg"
              >
                <div className="relative min-h-[200px] w-full">
                  <Image
                    src={item.imageUrl}
                    fill
                    alt={item.name}
                    className="rounded-md object-cover object-center"
                    quality={100}
                  />
                </div>
                <div className="flex h-full w-full flex-col gap-3 p-2 ">
                  <div className="flex flex-col gap-3">
                    <div className="flex h-[60px] justify-between">
                      <span className=" text-base text-gray-700 sm:max-w-[200px] md:max-w-[150px]">
                        {item.name}
                      </span>
                      <span className="text-md font-bold text-[#101518]">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {item.categories.map((c) => capitalize(c)).join(", ")}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 px-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-3 rounded-md bg-[#afb26e]/40 py-2 font-[500] text-[#101518] shadow-sm hover:bg-[#afb26e]/70 "
                      onClick={() => {
                        addToCart(item.id, 1);
                      }}
                    >
                      <AiOutlinePlus />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default Menu;
