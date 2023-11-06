import React, { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";
import { capitalize } from "~/utils/helper";

const Success = () => {
  const [products, setProducts] = useState<
    { id: string; quantity: number }[] | null 
  >(null);

  const { data: itemsInCart } = api.menu.getCartItems.useQuery(products ?? []);
  const total = (
    itemsInCart?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0
  ).toFixed(2);

  useEffect(() => {
    const data = localStorage.getItem("products");
    if (data) {
      const products = JSON.parse(data) as { id: string; quantity: number }[];			
    if (!products) return
    else {
      setProducts(products);
    }
	}
  }, []);

  if (products === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size={"xl"} color="green" />
      </div>
    );
  }
  
  return (
    <main className="relative m-auto min-h-full max-w-[1700px] md:flex">
      <div className="relative  h-80 md:h-screen md:w-1/2">
        <Image
          src="/checkout.jpg"
          fill
          alt="checkout image"
          className="object-cover object-center"
          quality={100}
        />
      </div>
      <div className="max-w-2xl py-10 pl-8 pr-8 md:py-24 md:pl-12 md:pr-20">
        <div className="flex flex-col gap-3">
          <span className="text-gray-700">Payment successful 👍</span>
          <span className="font-sans text-5xl font-[900] text-[#101518]">
            Thanks for ordering
          </span>
          <span className="text-gray-700">
            We appreciate your order, we’re currently processing it. So hang
            tight and we’ll send you confirmation very soon!
          </span>
        </div>
        <span className="mt-16 block text-gray-700">Your order summary</span>
        <ul
          role="list"
          className="mt-6 flex flex-col divide-y divide-gray-200 border-t border-gray-200"
        >
          {itemsInCart?.map((item) => (
            <li key={item.id} className="flex justify-between py-6">
              <div className="flex gap-3">
                <div className="relative h-24 w-24">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col ">
                  <span className="text-black">{item.name}</span>
                  <span className="text-sm text-gray-700">
                    {item.categories.map((c) => capitalize(c)).join(", ")}
                  </span>
                </div>
              </div>
              <div className="text-sm text-black">${item.price}</div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-20">
          <div className="flex items-center justify-between border-t py-8">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <Link href="/" className="self-end text-[#8ea86a]">
            Continue Shopping &rarr;
          </Link>
        </div>
        <div></div>
      </div>
    </main>
  );
};

export default Success;
