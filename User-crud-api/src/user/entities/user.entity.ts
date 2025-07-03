import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Decorator to mark this class as a TypeORM entity
export class User {
	@PrimaryGeneratedColumn() // Auto-incrementing primary key
	id: number;
 
	@Column({ unique: true }) // Column for email, must be unique
	email: string;
	
	@Column() // Column for first name
	firstName: string;

	@Column() // Column for last name
	lastName: string;
}
