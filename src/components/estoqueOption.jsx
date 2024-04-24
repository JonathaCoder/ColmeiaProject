import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import entrada from '../img/entrada.jpg'
import { Link } from 'react-router-dom';
import gerenciar from '../img/image.jpg';


export default function Options() {
  return (
  <div className='containerHome' >
    <Link to="/entrada" className='campos'>
    <Card sx={{ maxWidth: 345 }} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          src={entrada}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          Entrada/Saida
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Gerenciar a entrada e saida de estoque
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
</Link>
<Link to="/controle" className='campos'>
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          src={gerenciar}
          alt="green iguana"
         
        />
        
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
           Gerenciamento de Estoque
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Controle do esto
          </Typography>
        </CardContent>
 
      </CardActionArea>

    </Card>
    </Link>
   
    </div>

  );
}