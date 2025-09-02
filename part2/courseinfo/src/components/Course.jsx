const Header = ({ course }) => <h3>{course}</h3>

const Content = ({ parts }) => (
    <div>
        {parts.map(part => (<Part key={part.id} part={part} />))}
    </div>
)

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <p><b>Total of {total} exercises</b></p>
    )
}

export const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}