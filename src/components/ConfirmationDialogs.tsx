import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button, DialogTrigger } from '@fluentui/react-components'

interface ConfirmationDialogsProps {
    valid: boolean,
    mainFunction: () => void,
    buttonDescription:string,
    title:string,
    description:string,
    mainButtonText:string,
    secondaryButtonText:string,
    icon?: JSX.Element;
}

export default function ConfirmationDialogs({ props }: { props: ConfirmationDialogsProps }) {
    const { valid, mainFunction,buttonDescription,title,description,mainButtonText,secondaryButtonText,icon } = props
    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button disabled={!valid} icon={icon}>{buttonDescription}</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        {description}
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{secondaryButtonText}</Button>
                        </DialogTrigger>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary" onClick={mainFunction}>{mainButtonText}</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>



    )
}
