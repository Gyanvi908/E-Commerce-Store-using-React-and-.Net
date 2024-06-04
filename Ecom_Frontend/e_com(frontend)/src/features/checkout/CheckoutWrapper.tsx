import CheckoutPage from "./CheckoutPage";
import {Elements} from "@stripe/react-stripe-js"
import {loadStripe} from "@stripe/stripe-js"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripePromise = loadStripe('pk_test_51OzAvkGBuDeYQGmN8vXw49bVpvVFW4aovCkI8f1ybEaiaetFxSedwVfVCCj2EB6HINa8V3cxg7p6A1MvTZcRln7j00jCGySbus')
export default function CheckoutWrapper(){
    return(
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}