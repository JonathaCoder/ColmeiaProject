import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import agenda from "../img/agenda.jpg"
import { Link } from 'react-router-dom';
import estoque from '../img/estoque.jpg'

export default function ActionAreaCard() {
  return (
  <div className='containerHome' >
    <Link to="/clientes" className='campos'>
    <Card sx={{ maxWidth: 345 }} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          src={agenda}
          alt="green iguana"
        />
        <CardContent>


          <Typography gutterBottom variant="h5" component="div">
           Agenda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agendar Horarios e procedimentos 
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
</Link>
<Link to="/estoque" className='campos'>
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          src={estoque}
          alt="green iguana"
         
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Estoque
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Gerenciamento de Estoque 
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </Link>
    </div>

  );
}