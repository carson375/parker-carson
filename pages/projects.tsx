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

export default function Projects() {
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
        <Box sx={{ flexGrow: 1 }} width={200} paddingTop={2} paddingBottom={0}>
          <Grid container spacing={2}>
            <Typography paddingBottom={1} align='center'>
              List of Personal Projects
            </Typography>
          </Grid>
        </Box>
      </div>
    </Container>
  )
}
