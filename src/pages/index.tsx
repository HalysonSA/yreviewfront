import { useForm } from "react-hook-form";
import { BsFillEmojiFrownFill, BsFillEmojiSmileFill } from "react-icons/bs";
import axios from "./api/axios";
import { useState } from "react";

type TFormData = {
  title: string;
  description: string;
  rating: number;
  image: string[];
};

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TFormData>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    setIsLoading(true);

    const review = await axios.post("/review", {
      title: data.title,
      description: data.description,
      rating: Number(data.rating),
    });

    const images = Array.from(data.image);

    const a = images.map(async (image) => {
      formData.set("image", image);
      const response = await axios.post(
        `/image/${review.data.data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            //@ts-ignore
            let progress: number = Math.round((loaded * 100) / total); // total is possibly undefined
            console.log(`A imagem está ${progress}% carregada... `);
          },
        }
      );

      return response.data;
    });
    await Promise.all(a).then((values) => {
      console.log(values);
      setIsLoading(false);
    });
    reset();
  });

  return (
    <div className='w-screen min-h-screen flex flex-col justify-center items-center bg-[#465076] '>
      <div className='absolute top-5 right-5'>
        <button className='uppercase bg-gray-500 text-white rounded-[10px] px-10 py-4'>
          <a href='/reviews'>Ver reviews</a>
        </button>
      </div>
      <div className='min-w-[600px] p-4 bg-white rounded-[10px] min-h-[700px] '>
        <form
          id='review-form'
          onSubmit={onSubmit}
          className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label htmlFor=''>Titulo</label>
            <input
              type='text'
              {...register("title")}
              className='border border-black h-10 rounded-[10px] p-2'
            />
          </div>
          <div className='flex flex-col gap-1 '>
            <label htmlFor=''>Descrição</label>
            <textarea
              {...register("description")}
              className='border border-black rounded-[10px] min-h-[80px] p-2'
            />
          </div>
          <div className='flex flex-col gap-1 max-w-[50%]'>
            <label htmlFor=''>Avaliação</label>

            <input
              type='range'
              min={0}
              max={5}
              {...register("rating")}
              className='text-orange-400'
            />
            <div className='flex flex-row items-center justify-between my-1'>
              <BsFillEmojiFrownFill fill='#040552' size={40} />
              <BsFillEmojiSmileFill fill='#e0bf00' size={40} />
            </div>
          </div>
          <label htmlFor='select-file' tabIndex={0} className='file'>
            Anexe suas imagens
          </label>
          <input
            id='select-file'
            multiple
            type='file'
            accept='image/*'
            {...register("image")}
          />
          <div className='flex justify-end w-full'>
            <button
              type='submit'
              className='uppercase bg-green-700 text-white rounded-[10px] px-10 py-4'>
              {isLoading ? "Carregando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
}
