import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { now } from "~/constants/config";
import Spinner from "~/components/Spinner";
import Menu from "~/components/Menu";
import { api } from "~/utils/api";
import Cart from "~/components/Cart";

const MenuPage = () => {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [productsInCart, setProductsInCart] = useState<
    { id: string; quantity: number }[]
  >([]);

  const addToCart = (id: string, quantity: number) => {
    setProductsInCart((prev) => {
      const existsInCart = prev.find((item) => item.id === id);
      if (existsInCart) {
        return prev.map((item) => {
          if (item.id === id)
            return { ...item, quantity: item.quantity + quantity };
          return item;
        });
      }
      return [...prev, { id, quantity }];
    });
  };
  const removeFromCart = (id: string) => {
    setProductsInCart((prev) => prev.filter((item) => item.id !== id));
  };

  const { isFetchedAfterMount } = api.menu.checkMenuStatus.useQuery();
  useEffect(() => {
    const selectedTime = localStorage.getItem("selectedTime");
    if (!selectedTime) router.push("/");
    else {
      const date = parseISO(selectedTime);
      if (date < now) router.push("/");
    }
    setSelectedTime(selectedTime);
  }, [router]);
  return (
    <>
      <Cart
        open={showCart}
        setOpen={setShowCart}
        products={productsInCart}
        removeFromCart={removeFromCart}
      />
      <div className="h-full bg-[#1f2629]">
        {selectedTime && isFetchedAfterMount ? (
          <div className="m-auto h-full max-w-7xl bg-[#F5F4F2]">
            <Menu
              selectedTime={selectedTime}
              addToCart={addToCart}
              setOpen={setShowCart}
              products={productsInCart}
            />
          </div>
        ) : (
          true && (
            <div className="flex h-screen w-full items-center justify-center">
              <Spinner />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default MenuPage;
