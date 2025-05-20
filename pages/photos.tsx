import Container from 'components/Container'

import { Gallery } from '../components/Gallery/Gallery'

import photos from '../components/imageOptions.json'
import { useState } from 'react'
import { useTheme } from 'next-themes'
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
  const { resolvedTheme } = useTheme()

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
              <InputLabel
                id='demo-simple-select-label'
                sx={{
                  color: resolvedTheme === 'dark' ? 'white' : 'black',
                  '&.Mui-focused': {
                    color: resolvedTheme === 'dark' ? 'white' : 'black',
                  },
                }}
              >
                Trips
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                className='my-mui-select'
                id='demo-simple-select'
                label='Trips'
                onChange={e =>
                  onTripChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                sx={{
                  color: resolvedTheme === 'dark' ? 'white' : 'black', // text color
                  backgroundColor: resolvedTheme === 'dark' ? '#222' : '#fff', // background
                  '.MuiSvgIcon-root': {
                    color: resolvedTheme === 'dark' ? 'white' : 'black',
                  }, // arrow color
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor:
                        resolvedTheme === 'dark' ? '#222' : '#fff',
                      color: resolvedTheme === 'dark' ? 'white' : 'black',
                    },
                  },
                }}
              >
                {photoChoice.map((item, index) => (
                  <MenuItem
                    value={index}
                    key={index}
                    defaultValue={index}
                    sx={{
                      backgroundColor:
                        resolvedTheme === 'dark' ? '#222' : '#fff',
                      color: resolvedTheme === 'dark' ? 'white' : 'black',
                      '&.Mui-selected': {
                        backgroundColor:
                          resolvedTheme === 'dark' ? '#333' : '#eee',
                        color: resolvedTheme === 'dark' ? 'white' : 'black',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor:
                          resolvedTheme === 'dark' ? '#444' : '#ddd',
                      },
                      '&:hover': {
                        backgroundColor:
                          resolvedTheme === 'dark' ? '#333' : '#f5f5f5',
                      },
                    }}
                  >
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
