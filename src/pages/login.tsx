import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { HiLockClosed } from "react-icons/hi";
import { api } from "~/utils/api";

const Login = () => {
  const router = useRouter();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };
  const { mutate: login, isError } = api.admin.login.useMutation({
		onSuccess: () => {
			router.push('/dashboard')
		}
	});
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative h-12 w-full overflow-hidden">
            <Image
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              fill
              className="object-contiain"
              alt="logo"
            />
          </div>
          <h2 className="text-3xl font-bold">Sign in to your account</h2>
        </div>
        <form className="space-y-6">
          <div className="rounded-md shadow-sm ">
            <p className="pb-1 text-sm text-red-400">
              {isError && "Invalid login credentials"}
            </p>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email-address"
                placeholder="Email address"
                required
                value={input.email}
                onChange={handleChange}
                className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-40 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
                value={input.password}
                onChange={handleChange}
                className="relative block  w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-40 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="itams-center flex justify-between">
            <div className="flex items-center">
              <input
                name="remember-me"
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
						
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm block text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="tetx-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 focus:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                login(input);
              }}
            >
              <span className="absolute inset-0 left-0 flex items-center pl-3">
                <HiLockClosed className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
