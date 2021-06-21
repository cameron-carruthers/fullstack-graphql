import React, {useState} from 'react'
import gql from 'graphql-tag'
import PetBox from '../components/PetBox'
import NewPet from '../components/NewPet'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Loader from '../components/Loader'

const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      type
      img
    }
  }
`

const CREATE_PET = gql`
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
    }
  }
`

export default function Pets () {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(GET_PETS)
  const [createPet, { data: d, loading: l, error: e}] = useMutation(CREATE_PET, {
    update(cache, { data: { addPet }}) {
      const { pets } = cache.readQuery({ query: GET_PETS })
      cache.writeQuery({
        query: GET_PETS,
        data: { pets: pets.concat([addPet]) }
      });
    }
  })
  
  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: {newPet: input}
    })
  }

  const petsList = data.pets.map(pet => (
    <div className="col-xs-12 col-md-4 col" key={pet.id}>
      <div className="box">
        <PetBox pet={pet} />
      </div>
    </div>
  ))

  if (error || e) {
    return <p>An error has been detected!</p>
  }

  if (loading || l) {
    return <Loader />
  }
  
  if (modal) {
    return (
      <div className="row center-xs">
        <div className="col-xs-8">
          <NewPet onSubmit={onSubmit} onCancel={() => setModal(false)}/>
        </div>
      </div>
    )
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <div className="row">
          {petsList}
        </div>
      </section>
    </div>
  )
}
