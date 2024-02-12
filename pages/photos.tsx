import Container from 'components/Container'

import { Gallery } from '../components/Gallery/Gallery'

import photos from '../components/imageOptions.json'
import { useState } from 'react'
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material'

export default function Photos() {
  const [dataIndex, setDataIndex] = useState<number>(0)
  const [photoChoice] = useState(photos)
  const [isRender, setIsRender] = useState(false)

  const onTripChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataIndex(Number(e.target.value))
    setIsRender(true)
  }

  return (
    <Container>
      <div className='flex flex-col items-center justify-center inset-0'>
        <Typography paddingBottom={1} align='center'>
          Please select a trip from the dropdown to view the photos!
        </Typography>
        <Box sx={{ flexGrow: 1 }} width={200} paddingTop={2} paddingBottom={0}>
          <Grid container spacing={2}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Trips</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                className='my-mui-select'
                id='demo-simple-select'
                label='Trips'
                onChange={e =>
                  onTripChange(e as React.ChangeEvent<HTMLInputElement>)
                }
              >
                {photoChoice.map((item, index) => (
                  <MenuItem value={index} key={index} defaultValue={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Box>
        {isRender && <Gallery images={photos[dataIndex].photos} />}
      </div>
    </Container>
  )
}
