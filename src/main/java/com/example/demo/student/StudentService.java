package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.ObjectNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();

    }

    public void addStudent(Student student) throws BadRequestException {
        if (studentRepository.existsStudentByEmail(student.getEmail())) {
            throw new BadRequestException("Student already exists: " + student.getEmail());
        }
        studentRepository.save(student);
    }

    public void removeStudent(Long id) throws ObjectNotFoundException {
        if (!studentRepository.existsStudentById(id)) {
            throw new ObjectNotFoundException("Student do not exists with id: " + id);
        }
        studentRepository.deleteById(id);
    }
}
