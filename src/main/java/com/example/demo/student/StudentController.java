package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import javassist.tools.rmi.ObjectNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/students")
@AllArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public void addStudent(@Valid @RequestBody Student student) throws BadRequestException {
        studentService.addStudent(student);
    }

    @DeleteMapping(path = "{id}")
    public void removeStudent(@PathVariable("id") Long id) throws ObjectNotFoundException {
        studentService.removeStudent(id);
    }
}
