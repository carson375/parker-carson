import React from 'react'

import { Box, Grid } from '@mui/material'
import ModalImage from 'react-modal-image'

// The problem is this mapping is limited by the fact that the div is only 640 px wide we need to change that
export const Gallery = ({ images }) => (
  <Box sx={{ flexGrow: 1 }} p={6} paddingBottom={2}>
    <Grid item spacing={2}>
      {images.map((image, index) => (
        <>
          <ModalImage
            small={image}
            large={image}
            hideDownload={false}
            hideZoom={true}
            style='float:left'
            key={index}
            className='transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110'
          />
          <br />
        </>
      ))}
    </Grid>
  </Box>
)
