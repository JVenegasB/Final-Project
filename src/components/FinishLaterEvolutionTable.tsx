import React, { useEffect, useState } from 'react'
import { TableColumnDefinition, Spinner, createTableColumn, useTableFeatures, useTableSort, TableColumnId, Table, TableHeader, TableHeaderCell, TableRow, TableBody, TableCell, Dialog, DialogContent, DialogBody, DialogTitle, DialogSurface, DialogActions, Button, Checkbox } from "@fluentui/react-components";
import { EvolutionToComplete, EvolutionType } from '../types/types';
import TextFieldToComplete from './TextFieldToComplete';
import InputFieldToComplete from './InputFieldToComplete';
import { client } from '../supabase/client'

const columns: TableColumnDefinition<EvolutionToComplete>[] = [
    createTableColumn<EvolutionToComplete>({
        columnId: 'id',
        compare: (a, b) => a.id - b.id,
    }),
    createTableColumn<EvolutionToComplete>({
        columnId: 'patient_name',
        compare: (a, b) => a.patient_name.localeCompare(b.patient_name),
    }),
    createTableColumn<EvolutionToComplete>({
        columnId: 'attended_date',
        compare: (a, b) => a.attended_date.localeCompare(b.attended_date),
    }),
];

interface Props {
    isFinishLaterEvolution: EvolutionToComplete[];
    fetchFinishLaterEvolutions: () => void;
}

export default function FinishLaterEvolutionTable({ isFinishLaterEvolution, fetchFinishLaterEvolutions }: Props) {
    const {
        getRows,
        sort: { getSortDirection, toggleColumnSort, sort },
    } = useTableFeatures(
        {
            columns: columns,
            items: isFinishLaterEvolution
        },
        [useTableSort({
            defaultSortState: { sortColumn: "file", sortDirection: "ascending" },
        })]
    );
    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });
    const rows = sort(getRows());

    //Dialog Controls
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<EvolutionType | null>(null);
    const [formDataMirror, setFormDataMirror] = useState<EvolutionType | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    //Validate form completeness
    useEffect(() => {
        const hasEmptyFields = (data: EvolutionType | null): boolean => {
            for (const key in data) {
                const value = data[key as keyof EvolutionType];

                if (key === 'therapy' && !data.is_alternative) {
                    continue;
                }
                if (value === '' || value === undefined || value === null) {
                    return true;
                }
            }
            return false;
        };
        console.log(formData)
        setIsComplete(!hasEmptyFields(formData));
    }, [formData]);

    //select evolution
    const selectEvolution = (evolution: EvolutionType) => {
        setFormData(evolution);
        setFormDataMirror(evolution);
        setOpen(true);
    }

    async function sendData(): Promise<void> {
        const dataToSend = {
            ...formData,
            is_finish_later: false,
        }
        const { data, error } = await client
            .rpc('update_evolution', {
                current_illness: dataToSend.current_illness,
                diagnosis: dataToSend.diagnosis,
                id: dataToSend.evolution_id,
                is_alternative: dataToSend.is_alternative,
                is_finish_later: dataToSend.is_finish_later,
                motive: dataToSend.motive,
                physical_exam: dataToSend.physical_exam,
                plan: dataToSend.plan,
                therapy: dataToSend.therapy,
            })
        if (error) {
            console.error('Error updating evolution:', error)
            return
        } else {
            console.log('Evolucion completada correctamente',data)
            setOpen(false);
            setFormData(null);
            setFormDataMirror(null);
            setIsComplete(false);
            fetchFinishLaterEvolutions()
        }
    }

    function closeDialog(): void {
        setOpen(false);
        setFormData(null);
        setIsComplete(false);
    }

    const handleDataChange = (input: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = input.target;
        setFormData((prev) => {
            if (prev) {
                return {
                    ...prev,
                    [name]: value,
                };
            }
            return null;
        });
    }
    function handleIsAlternative(): void {
        setFormData((prev) => {
            if (prev) {
                const newIsAlternative = !prev.is_alternative;
                return {
                    ...prev,
                    is_alternative: newIsAlternative,
                    therapy: newIsAlternative ? prev.therapy : '',
                };
            }
            return null;
        });
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell {...headerSortProps("patient_name")}>Id</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("patient_name")}>Nombre</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("attended_date")}>Cedula</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFinishLaterEvolution === null && <TableRow><TableCell colSpan={3}><Spinner size='extra-large' className='my-12' /></TableCell></TableRow>}
                    {isFinishLaterEvolution.length === 0 && <TableRow><TableCell colSpan={3}>No hay evoluciones pendientes</TableCell></TableRow>}
                    {rows.map(({ item }, index) => (
                        <TableRow key={index} onClick={() => selectEvolution(item)}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.patient_name}</TableCell>
                            <TableCell>{item.attended_date}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
            <Dialog open={open}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Completar evolucion</DialogTitle>
                        {formData ? (
                            <DialogContent className='space-y-5'>
                                <InputFieldToComplete type='date' input={formData.attended_date} label='Fecha de atencion' isComplete={true} />
                                <TextFieldToComplete input={formData.motive} isComplete={formDataMirror?.motive !== '' && formDataMirror?.motive !== null} label='Motivo de consulta' handleDataChange={handleDataChange} id='motive' />
                                <TextFieldToComplete input={formData.current_illness} isComplete={formDataMirror?.current_illness !== '' && formDataMirror?.current_illness !== null} label='Enfermedad actual' handleDataChange={handleDataChange} id='current_illness' />
                                <TextFieldToComplete input={formData.physical_exam} isComplete={formDataMirror?.physical_exam !== '' && formDataMirror?.physical_exam !== null} label='Examen fisico' handleDataChange={handleDataChange} id='physical_exam' />
                                <TextFieldToComplete input={formData.diagnosis} isComplete={formDataMirror?.diagnosis !== '' && formDataMirror?.diagnosis !== null} label='Diagnostico' handleDataChange={handleDataChange} id='diagnosis' />
                                <TextFieldToComplete input={formData.plan} isComplete={formDataMirror?.plan !== '' && formDataMirror?.plan !== null} label='Plan' handleDataChange={handleDataChange} id='plan' />
                                <Checkbox label='Es terapia alternativa?' onChange={handleIsAlternative} checked={formData?.is_alternative} />

                                {formData.is_alternative &&
                                    <TextFieldToComplete input={formData.therapy} isComplete={formDataMirror?.therapy !== '' && formDataMirror?.therapy !== null} label='Terapia' handleDataChange={handleDataChange} id='therapy' />
                                }
                            </DialogContent>
                        ) : (<DialogContent className='space-y-5'><Spinner size='extra-large' className='my-12' /></DialogContent>)}
                        <DialogActions>
                            <Button onClick={() => closeDialog()} appearance='secondary'>Cerrar</Button>
                            <Button appearance='primary' onClick={() => sendData()} disabled={!isComplete}>Enviar</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    )
}
