import React, { type ChangeEvent, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { MultiValue } from "react-select/dist/declarations/src";
import { selectOptions } from "~/utils/helper";
import Image from "next/image";
import { api } from "~/utils/api";
import type { Categories } from "src/utils/types";
import { UploadButton } from "~/utils/uploadthing";
import type { UploadFileResponse } from "uploadthing/client";
const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });
type InputType = {
  name: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: { fileUrl: string; fileKey: string } | undefined;
};
const initialInput = {
  name: "",
  price: 0,
  categories: [],
  file: { fileUrl: "", fileKey: "" },
};

const DashMenu = () => {
  const [input, setInput] = useState<InputType>(initialInput);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (res: UploadFileResponse[] | undefined) => {
    if (!res) return setError("No File");
    const { fileUrl, fileKey } = res[0] as { fileUrl: string; fileKey: string };
    setInput((prev) => ({ ...prev, file: { fileUrl, fileKey } }));
  };

  const { mutateAsync: addItem } = api.admin.addMenuItem.useMutation();
  const { data: menuItems, refetch } = api.menu.getMenuItems.useQuery();

  const { mutateAsync: deleteMenuItem } =
    api.admin.deleteMenuItem.useMutation();

  const handleDelete = async (imageKey: string, id: string) => {
    await deleteMenuItem({ imageKey, id });
    await refetch();
  };

  const addMenuItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!input.file) throw new Error("No url");

    await addItem({
      imageUrl: input.file.fileUrl,
      imageKey: input.file.fileKey,
      name: input.name,
      price: Number(input.price),
      categories: input.categories.map((c) => c.value as Categories),
    });
    await refetch();
    setInput(initialInput);
    setPreview("");
  };

  useEffect(() => {
    if (input?.file?.fileUrl) {
      setPreview(input.file.fileUrl);
    }
  }, [input.file]);
  return (
    <div className="h-screen ">
      <div className="w-full bg-[#666b45]">
        <div className="m-auto flex max-w-3xl flex-col gap-2 p-8 ">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleTextChange}
            value={input.name}
            className="w-full rounded-md px-4 py-2 text-black placeholder-gray-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleTextChange}
            value={input.price}
            className="w-full rounded-md px-4 py-2 text-gray-500"
          />
          <DynamicSelect
            value={input.categories}
						// @ts-expect-error - when using dynamic import, typescript doesn't know about the onChange prop
            onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
            isMulti
            className=" w-full rounded-lg"
            options={selectOptions}
          />
          <label
            htmlFor="file"
            className="relative h-full w-full cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-gray-500"
          >
            <span className="sr-only">File input</span>
            <div className="flex h-[100px] items-center justify-center">
              {preview ? (
                <div className="relative h-3/4 w-full">
                  <Image
                    src={preview}
                    fill
                    className="object-contain"
                    alt="preview"
                  />
                </div>
              ) : (
                <span>preview:</span>
              )}
            </div>
            <UploadButton
              className="ut-button:bg-[#666b45] ut-button:font-[700]"
              endpoint="imageUploader"
              onClientUploadComplete={(res: UploadFileResponse[] | undefined) => {
                handleFileSelect(res);
              }}
              onUploadError={(error: Error) => {
                setError(error.message);
              }}
            />
          </label>
          <button
            onClick={addMenuItem}
            className="flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-gray-500"
          >
            Add menu item
          </button>
          {error && (
            <span className="text-lg text-red-800 underline">{error}!</span>
          )}
        </div>
      </div>
      <div className="w-full bg-[#F5F4F2]">
        <div className=" m-auto grid max-w-7xl grid-cols-1 items-center gap-4  p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {menuItems?.map((item) => (
            <div
              key={item.id}
              className="flex h-[350px] w-full  flex-col items-center gap-1 rounded-md bg-white p-2 shadow-md"
            >
              <div className="relative min-h-[200px] w-full">
                <Image
                  src={item.imageUrl}
                  fill
                  alt="image"
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex h-full w-full  flex-col justify-between  p-2">
                <div className="flex flex-col items-start">
                  <h2 className="text-lg">{item.name}</h2>
                  <p className="font-bold text-gray-500">{item.price}$</p>
                </div>
                <button
                  onClick={() => handleDelete(item.imageKey, item.id)}
                  className=" rounded-md bg-[#F5F4F2] p-1 text-lg text-red-500"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashMenu;
