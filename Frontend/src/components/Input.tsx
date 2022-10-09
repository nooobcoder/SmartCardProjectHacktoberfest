interface Props {
  placeholder?: string;
}

const Input = ({ placeholder = `Placeholder` }: Props) => {
  return (
    <div className='mb-3 pt-0'>
      <input
        type='text'
        placeholder={placeholder.toUpperCase()}
        className='relative w-full rounded border-slate-300 bg-white px-3 py-3  text-center text-sm text-slate-600 placeholder-slate-300 outline-none focus:outline-none focus:ring focus:ring-blue-400'
      />
    </div>
  );
};

export default Input;
