package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.ObjectNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    private StudentService underTest;

    @BeforeEach
    void setUp() {
        underTest = new StudentService(studentRepository);
    }

    @Test
    void canGetAllStudents() {
        //when
        underTest.getAllStudents();
        //then
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        //given
        Student student = new Student(
                "Jamila",
                "jamila@gmail.com",
                Gender.FEMALE
        );
        //when
        underTest.addStudent(student);

        // then
        ArgumentCaptor<Student> studentArgumentCaptor =
                ArgumentCaptor.forClass(Student.class);

        verify(studentRepository)
                .save(studentArgumentCaptor.capture());

        Student capturedStudent = studentArgumentCaptor.getValue();

        assertThat(capturedStudent).isEqualTo(student);
    }

    @Test
    void willThrowWhenEmailIsTaken() {
        //given
        Student student = new Student(
                "Jamila",
                "jamila@gmail.com",
                Gender.FEMALE
        );

        given(studentRepository.existsStudentByEmail(anyString()))
                .willReturn(true);

        //when
        // then
        assertThatThrownBy(()-> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Student already exists: " + student.getEmail());

        verify(studentRepository, never()).save(any());
    }

    @Test
    void removeStudent() {
        //given
        long id = 10;
        given(studentRepository.existsStudentById(id))
                .willReturn(true);

        // When
        underTest.removeStudent(id);

        // Then
        verify(studentRepository)
                .deleteById(id);
    }

    @Test
    void willThrowWhenDeleteStudentNotFound() {
        //given
        long id = 10;
        given(studentRepository.existsStudentById(id))
                .willReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> underTest.removeStudent(id))
                .isInstanceOf(ObjectNotFoundException.class)
                .hasMessageContaining("Student do not exists with id: " + id);

        verify(studentRepository, never()).deleteById(any());
    }
}