package com.example.demo.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository underTest;

    @Test
    void itShouldCheckIfStudentExistsByEmail() {
        //given
        String email = "jamila@gmail.com";
        Student student = new Student(
                "Jamila",
                email,
                Gender.FEMALE
        );
        underTest.save(student);

        //when
        boolean expected = underTest.existsStudentByEmail(email);

        //then
        assertThat(expected).isTrue();
    }

    @Test
    void itShouldCheckIfStudentDoesNotExistsByEmail() {
        //given
        String email = "jamila@gmail.com";

        //when
        boolean expected = underTest.existsStudentByEmail(email);

        //then
        assertThat(expected).isFalse();
    }

    @Test
    @Disabled
    void itShouldCheckIfStudentExistsById() {
        //given
        String email = "jamila@gmail.com";
        Long id = 1L;
        Student student = new Student(
                "Jamila",
                email,
                Gender.FEMALE
        );
        underTest.save(student);

        //when
        boolean expected = underTest.existsStudentById(id);

        //then
        assertThat(expected).isTrue();
    }

    @Test
    void itShouldCheckIfStudentDoesNotExistsById() {
        //given
        Long id = 1L;

        //when
        boolean expected = underTest.existsStudentById(id);

        //then
        assertThat(expected).isFalse();
    }

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }
}