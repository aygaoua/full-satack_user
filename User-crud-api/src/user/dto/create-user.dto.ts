import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
	@IsEmail({}, { message: 'Email must be a valid email address' }) // Validate if it's a valid email format
	@IsNotEmpty({ message: 'Email cannot be empty' }) // Validate if it's not empty
	email: string;
	
	@IsString({ message: 'First name must be a string' }) // Validate if it's a string
	@IsNotEmpty({ message: 'First name cannot be empty' }) // Validate if it's not empty
	firstName: string;
	
	@IsString({ message: 'Last name must be a string' }) // Validate if it's a string
	@IsNotEmpty({ message: 'Last name cannot be empty' }) // Validate if it's not empty
	lastName: string;
}
