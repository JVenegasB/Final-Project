import {Link} from 'react-router-dom';


export default function NotFoundPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className='font-extrabold text-4xl font-roboto'>Error 404: Page Not Found</h1>
      <p className='m-5 font-openSans'>Parece que estar perdido!</p>
        <Link to='/' className="group relative font-openSans flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Regresar al inicio</Link>
    </div>
  );
}