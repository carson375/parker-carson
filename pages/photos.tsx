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
    <Container
      maxWidth={false}
      sx={{ maxWidth: '1800px', margin: '0 auto', padding: '2rem' }}
    >
      <div
        className='flex flex-col justify-center inset-0 w-full'
        style={{ maxWidth: '100%' }}
      >
        <Typography paddingBottom={1} align='center'>
          Please select a trip from the dropdown to view the photos!
        </Typography>
        <Box
          sx={{ flexGrow: 1, width: '100%' }}
          paddingTop={2}
          paddingBottom={0}
        >
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <FormControl sx={{ minWidth: 240 }}>
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
                  color: resolvedTheme === 'dark' ? 'white' : 'black',
                  backgroundColor: resolvedTheme === 'dark' ? '#222' : '#fff',
                  '.MuiSvgIcon-root': {
                    color: resolvedTheme === 'dark' ? 'white' : 'black',
                  },
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
          </div>
        </Box>
        {/* Gallery will now use the full width */}
      </div>
      {isRender && (
        <div
          style={{
            width: '1000px',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            marginLeft: '-180px',
          }}
        >
          <div style={{ maxWidth: '100%' }}>
            <Gallery images={photos[dataIndex].photos} perRow={3} />
          </div>
        </div>
      )}
    </Container>
  )
}
