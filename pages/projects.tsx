import Container from 'components/Container'

import { Gallery } from '../components/Gallery/Gallery'

import photos from '../components/imageOptions.json'
import { useTheme as useNextTheme } from 'next-themes'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import { useState } from 'react'
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

export default function Projects() {
  const { resolvedTheme } = useNextTheme()
  const theme = useMuiTheme()
  const [projects] = useState([
    {
      id: 1,
      name: 'Autonomous Drone Development',
      description: [
        'Led a team of four engineers, implementing agile methodology, to develop an autonomous drone capable of determining WiFi readings along a predefined path.',
        'Developed an interactive user interface using TypeScript, React, and hosted on Azure, enabling users to input the data path and visualize a heatmap generated from the WiFi readings.',
        'Utilized Python and SQL to develop APIs for storing data, reading data from the microcontroller, and creating flight paths and heatmaps.',
      ],
    },
    {
      id: 2,
      name: 'Classification Using Machine Learning',
      description: [
        'Classified constellation data by developing predictive models to identify the constellation based on diverse data inputs.',
        'Utilized Python, along with scikit-learn and NumPy, to implement two different methods for constellation preiction: linear classifications and a neural network.',
        'Utilized a support vector machine in combination with different standardization methods to optimize data classification in the linear model.',
        'Explored the impact of altering channel count, learning rates, and data optimizers to create an optimal deep neural network.',
      ],
    },
    {
      id: 3,
      name: 'Propagate Uncertainty',
      description: [
        'Combined with a co-worker to create a web application that propagated measurement uncertainty through an expression.',
        'Utilized Python APIs to transmit user information to the back-end components for calculations.',
        'Learned how to set up and host a website through Google Cloud.',
      ],
    },
  ])

  return (
    <Container
      sx={{
        maxWidth: '800px', // Increase the maximum width of the container
        margin: '0 auto', // Center the container
        padding: '2rem', // Add padding for better spacing
      }}
    >
      <div className='flex flex-col items-center justify-center inset-0'>
        <Box
          sx={{
            flexGrow: 1,
            width: '100%', // Ensure the box takes the full width of the container
            paddingTop: 2,
            paddingBottom: 2,
          }}
        >
          <Grid container spacing={2}>
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
              color={
                resolvedTheme === 'dark'
                  ? theme.palette.grey[300] // Light text for dark mode
                  : theme.palette.text.primary
              }
            >
              List of Personal Projects
            </Typography>
          </Grid>
          <List>
            {projects.map(project => (
              <ListItem key={project.id} divider>
                <ListItemText
                  primary={project.name}
                  secondary={
                    Array.isArray(project.description) ? ( // Check if description is an array
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '1.5rem',
                          color:
                            resolvedTheme === 'dark'
                              ? theme.palette.grey[300] // Light text for dark mode
                              : theme.palette.text.secondary,
                          listStyleType: 'disc',
                        }}
                      >
                        {project.description.map((item, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span
                        style={{
                          color:
                            resolvedTheme === 'dark'
                              ? theme.palette.grey[300] // Light text for dark mode
                              : theme.palette.text.secondary,
                        }}
                      >
                        {project.description}
                      </span>
                    )
                  }
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color:
                        resolvedTheme === 'dark'
                          ? theme.palette.grey[300] // Light text for dark mode
                          : theme.palette.text.primary,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </Container>
  )
}
