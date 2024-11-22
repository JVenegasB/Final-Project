import { useThemeContext } from "../context/themeContext";
import { EvolutionToComplete, PatientMainData } from "../types/types";
import FinishLaterEvolutionTable from "./FinishLaterEvolutionTable";
import FinishLaterHistory from "./FinishLaterHistory";
interface Props {
    isFinishLaterEvolution: EvolutionToComplete[];
    isFinishLaterHistory: PatientMainData[];
    fetchPatientList: () => void;
    fetchFinishLaterEvolutions: () => void;
}

export default function FinishLater({ isFinishLaterEvolution, isFinishLaterHistory,fetchPatientList,fetchFinishLaterEvolutions }: Props) {
    const { isDarkMode } = useThemeContext();
    return (
        <div className='flex flex-col h-full w-full'>
            <div className="px-2 grid lg:grid-cols-2">
                <div className=" h-[calc((100vh-143px)/2)] overflow-y-auto">
                    <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md `}>
                        <h3 className="px-2 py-3 font-bold font-roboto text-xl">Historias incompletas</h3>
                        <FinishLaterHistory isFinishLaterHistory={isFinishLaterHistory} fetchPatientList={fetchPatientList}/>
                    </div>

                </div>
                <div className=" h-[calc((100vh-143px)/2)] overflow-y-auto">
                    <div className={`m-3 p-3 ${isDarkMode ? "bg-secondaryBgDark" : "bg-secondaryBgLight"} rounded-md `}>
                        <h3 className="px-2 py-3 font-bold font-roboto text-xl">Evoluciones incompletas</h3>
                        <FinishLaterEvolutionTable isFinishLaterEvolution={isFinishLaterEvolution} fetchFinishLaterEvolutions={fetchFinishLaterEvolutions}/>
                    </div>

                </div>
            </div>
        </div>
    )
}
