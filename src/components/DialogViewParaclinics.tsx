import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from '@fluentui/react-components'
import { paraclinicsType } from '../types/types'


export default function DialogViewParaclinics({ paraclinic }: { paraclinic: paraclinicsType }) {
    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button>Ver {paraclinic.title || "Paraclinico"}</Button>
            </DialogTrigger>
            <DialogSurface style={{ maxWidth: '90%', maxHeight: '90%', height: '90%' }}>
                <DialogBody>
                    <DialogTitle>Ver {paraclinic.title || "Paraclinico"}</DialogTitle>
                    <DialogContent>
                        {paraclinic.file_type === 'application/pdf' ? (
                            <div>
                                <iframe src={paraclinic.real_url} width='100%' height='100%' title={paraclinic.date_uploaded} className='min-h-[calc(100vh-200px)]'/>
                            </div>

                        ) : (
                            <div>
                                <img src={paraclinic.real_url} title={paraclinic.date_uploaded} alt={paraclinic.date_uploaded} className='h-[calc(100vh-200px)]'/>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Cerrar</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}
