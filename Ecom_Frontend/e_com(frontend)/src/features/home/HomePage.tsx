//import { Typography } from "@mui/material";
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';

export default function HomePage(){
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
    return(
        <>
        <Slider {...settings}>
          <div>
            <img src="/images/h1.jpg" alt="h1" style={{display: 'black', width: '100%', maxHeight:500}} />
          </div>
          <div>
            <img src="/images/h2.jpg" alt="h2" style={{display: 'black', width: '100%', maxHeight:500}} />
          </div>
          <div>
            <img src="/images/h3.jpg" alt="h3" style={{display: 'black', width: '100%', maxHeight:500}} />
          </div>
        </Slider>

        <Box display='flex' justifyContent='center' sx={{p: 4}}>
            <Typography variant='h1'>
                Welcome To The Store!
            </Typography>
        </Box>
        </>
    )
}