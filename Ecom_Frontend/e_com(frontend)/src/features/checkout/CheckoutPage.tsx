/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";

interface Props{
    cardState: { elementError: {[key in StripeElementType]?: string}};
    onCardInputChange: (event: any) => void;
}
const steps = ['Shipping address', 'Review your order', 'Payment details'];


export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderNumber, setOrderNumber] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dispatch = useAppDispatch();

    const [cardState, setCardState] = useState<{elementError: {[key in StripeElementType]?: string}}>({elementError:{}})
    const[cardComplete, setCardComplete] = useState<any>({cardNumber: false, cardExpiry: false, cardCvc: false});
  
    function onCardInputChange(event: any){
      setCardState({
        ...cardState,
        elementError: {
          ...cardState.elementError,
          [event.elementType]: event.error?.message
        }
      })
      setCardComplete({...cardComplete, [event.elementType]: event.complete});
    }
    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange}/>;
            default:
                throw new Error('Unknown step');
        }
    }
    const currentValidationSchema= validationSchema[activeStep];
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(currentValidationSchema)
    });

    useEffect(() => {
        agent.Account.fetchAddress()
        .then(response => {
            if(response) {
                methods.reset({...methods.getValues(), ...response, saveaAddress: false})
            }
        })
    }, [methods])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleNext = async (data: FieldValues) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {nameOnCard, saveAddress, ...shippingAddress} = data;
        if(activeStep === steps.length -1){
            setLoading(true);
            try{
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const orderNumber = await agent.Orders.create({saveAddress, shippingAddress});
       setOrderNumber(orderNumber);
       setActiveStep(activeStep +1);
       dispatch(clearBasket());
       setLoading(false);
            }catch (error){
                console.log(error);
                setLoading(false);
            }
        }else {
            setActiveStep(activeStep + 1);
        }
        
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function submitDisabled(): boolean{
        if(activeStep === steps.length-1){
            return !cardComplete.cardCvc
            || !cardComplete.cardExpiry
            || !cardComplete.cardNumber
            || !methods.formState.isValid
        }else{
            return !methods.formState.isValid
        }
    }

    return (
      <FormProvider {...methods}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                            Your order number is #{orderNumber}. We have not emailed your order
                            confirmation, and will not send you an update when your order has
                            shipped as this is a fake store!
                        </Typography>
                    </>
                ) : (
                    <form onSubmit={methods.handleSubmit(handleNext)}>
                        {getStepContent(activeStep)}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                    Back
                                </Button>
                            )}
                            <LoadingButton
                            loading={loading}
                            disabled={!methods.formState.isValid}
                                variant="contained"
                                type='submit'
                                sx={{mt: 3, ml: 1}}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </LoadingButton>
                        </Box>
                        </form>
                        )}
                    </>
              
           
        </Paper>
        </FormProvider>
    );
}

