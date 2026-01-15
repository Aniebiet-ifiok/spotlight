import React from 'react'

type step = {
  id: string
  title: string
  description: string
  component: React. ReactNode
}

type props = {
    steps: step[]
    onComplete: (id: string) => void
}



const MultiStepForm = ({steps, onComplete}: props) => {

    return (
        <div>MultiStepForm</div>
    )
}

export default MultiStepForm;