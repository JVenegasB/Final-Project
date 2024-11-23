import { Link } from 'react-router-dom';


export default function InfoPage() {

  return (
    
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 shadow-md">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
            <span className="text-xl font-bold text-white mb-2 sm:mb-0 font-roboto">
              Nombre del proyecto
            </span>
            <div>
              <Link to="/login" className="bg-primary font-openSans text-white hover:bg-blue-800 px-4 py-2 rounded">
                Iniciar Sesion
              </Link>
              <Link to="/signup" className="bg-primary font-openSans text-white hover:bg-blue-800 px-4 py-2 rounded">
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <>
            <section className="mb-12">
              <h1 className="text-4xl font-roboto font-bold text-gray-800 mb-4">Descripcion de la aplicacion </h1>
              <p className="text-lg text-gray-600 font-lato">
                La aplicación es una herramienta de software que busca ayudar a consultorios medicos a gestionar procesos. Entre estos procesos se incluyen:
              </p>
              <ul className="list-disc list-inside mt-4 text-gray-600 font-lato">
                <li>Gestion de historias clinicas</li>

              </ul>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-roboto">Gestion de historias clincicas</h2>
              <p className="text-gray-600 font-openSans">
                Objetivo: Automatizar el proceso de gestion de historias clinicas
              </p>
              <p className="text-gray-600 mt-3 font-openSans">
                Caracteristicas:
              </p>
              <ul className="list-disc list-inside mt-4 text-gray-600 font-openSans">
                <li>Facilitar la gestion y ordenamiento de historias clinicas y datos de pacientes</li>
                <li>Permitir al usuario crear, visualizar y modificar historias clinicas</li>
                <li>Permitir la creacion de evoluciones, parte de cada paciente</li>
                <li>Permitir a los usuarios ver y crear evoluciones medicas como parte de la historia
                  medica de cada paciente </li>
                <li>Permitir al usuario exportar historias clinicas como PDF</li>
              </ul>
            </section>
          </>
        </main>
      </div>

  )
}